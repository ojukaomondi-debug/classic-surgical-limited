import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, Users, Package, FileText, Wrench, BookOpen } from 'lucide-react';
import { storefrontApiRequest, PRODUCTS_QUERY, ShopifyProduct } from '@/lib/shopify';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import AdminOverview from '@/components/admin/AdminOverview';
import AdminUserManagement from '@/components/admin/AdminUserManagement';
import AdminProducts from '@/components/admin/AdminProducts';
import AdminQuotations from '@/components/admin/AdminQuotations';
import AdminServiceRequests from '@/components/admin/AdminServiceRequests';
import AdminLearningContent from '@/components/admin/AdminLearningContent';

interface UserWithRole {
  user_id: string;
  full_name: string | null;
  role: string;
}

const navItems = [
  { label: 'Overview', icon: <LayoutDashboard size={18} />, path: '/admin?tab=overview' },
  { label: 'Users & Roles', icon: <Users size={18} />, path: '/admin?tab=users' },
  { label: 'Products', icon: <Package size={18} />, path: '/admin?tab=products' },
  { label: 'Quotations', icon: <FileText size={18} />, path: '/admin?tab=quotations' },
  { label: 'Services', icon: <Wrench size={18} />, path: '/admin?tab=services' },
  { label: 'Learning', icon: <BookOpen size={18} />, path: '/admin?tab=learning' },
];

const AdminDashboard = () => {
  const { user, role, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';

  const [users, setUsers] = useState<UserWithRole[]>([]);
  const [products, setProducts] = useState<ShopifyProduct[]>([]);
  const [fetching, setFetching] = useState(true);
  const [quotationCount, setQuotationCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);

  useEffect(() => {
    if (role !== 'admin') return;

    const fetchData = async () => {
      const [profilesRes, rolesRes, productsRes, quotationsRes, servicesRes] = await Promise.all([
        supabase.from('profiles').select('user_id, full_name'),
        supabase.from('user_roles').select('user_id, role'),
        storefrontApiRequest(PRODUCTS_QUERY, { first: 50 }).catch(() => null),
        supabase.from('quotation_requests').select('id', { count: 'exact', head: true }),
        supabase.from('service_requests').select('id', { count: 'exact', head: true }),
      ]);

      if (profilesRes.data && rolesRes.data) {
        const merged = profilesRes.data.map((p) => ({
          ...p,
          role: rolesRes.data.find((r) => r.user_id === p.user_id)?.role ?? 'user',
        }));
        setUsers(merged);
      }

      if (productsRes?.data?.products?.edges) {
        setProducts(productsRes.data.products.edges);
      }

      setQuotationCount(quotationsRes.count || 0);
      setServiceCount(servicesRes.count || 0);
      setFetching(false);
    };

    fetchData();
  }, [role]);

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20" />
        <p className="text-muted-foreground text-sm">Loading dashboard...</p>
      </div>
    </div>
  );

  if (!user || role !== 'admin') return <Navigate to="/" replace />;

  const renderContent = () => {
    switch (tab) {
      case 'users':
        return <AdminUserManagement users={users} setUsers={setUsers} currentUserId={user.id} fetching={fetching} />;
      case 'products':
        return <AdminProducts products={products} onProductsChange={setProducts} />;
      case 'quotations':
        return <AdminQuotations />;
      case 'services':
        return <AdminServiceRequests />;
      case 'learning':
        return <AdminLearningContent />;
      default:
        return (
          <AdminOverview
            userCount={users.length}
            productCount={products.length}
            quotationCount={quotationCount}
            serviceCount={serviceCount}
            adminCount={users.filter(u => u.role === 'admin').length}
          />
        );
    }
  };

  return (
    <DashboardLayout
      navItems={navItems}
      title="Admin Panel"
      subtitle="Classic Surgicals"
      onSignOut={handleSignOut}
      headerExtra={
        <h2 className="font-display font-semibold text-foreground capitalize">
          {tab === 'overview' ? 'Dashboard' : tab}
        </h2>
      }
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default AdminDashboard;

import { useAuth } from '@/hooks/useAuth';
import { Navigate, useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, ShoppingBag, FileText, Send, Wrench, PlusCircle, BookOpen, Settings } from 'lucide-react';
import DashboardLayout from '@/components/dashboard/DashboardLayout';
import UserOverview from '@/components/user/UserOverview';
import UserCart from '@/components/user/UserCart';
import UserQuotations from '@/components/user/UserQuotations';
import UserRequestQuote from '@/components/user/UserRequestQuote';
import UserServiceRequests from '@/components/user/UserServiceRequests';
import UserNewServiceRequest from '@/components/user/UserNewServiceRequest';
import UserLearningCenter from '@/components/user/UserLearningCenter';
import UserProfileSettings from '@/components/user/UserProfileSettings';

const navItems = [
  { label: 'Overview', icon: <LayoutDashboard size={18} />, path: '/dashboard?tab=overview' },
  { label: 'Browse Shop', icon: <ShoppingBag size={18} />, path: '/shop' },
  { label: 'My Cart', icon: <ShoppingBag size={18} />, path: '/dashboard?tab=cart' },
  { label: 'My Quotations', icon: <FileText size={18} />, path: '/dashboard?tab=quotations' },
  { label: 'Request Quote', icon: <Send size={18} />, path: '/dashboard?tab=request-quote' },
  { label: 'My Services', icon: <Wrench size={18} />, path: '/dashboard?tab=services' },
  { label: 'Request Service', icon: <PlusCircle size={18} />, path: '/dashboard?tab=new-service' },
  { label: 'Learning Center', icon: <BookOpen size={18} />, path: '/dashboard?tab=learning' },
  { label: 'Settings', icon: <Settings size={18} />, path: '/dashboard?tab=settings' },
];

const UserDashboard = () => {
  const { user, loading, signOut } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const tab = searchParams.get('tab') || 'overview';

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-background">
      <div className="animate-pulse flex flex-col items-center gap-3">
        <div className="w-10 h-10 rounded-full bg-primary/20" />
        <p className="text-muted-foreground text-sm">Loading...</p>
      </div>
    </div>
  );

  if (!user) return <Navigate to="/auth" replace />;

  const displayName = user.user_metadata?.full_name || user.email?.split('@')[0] || 'User';

  const renderContent = () => {
    switch (tab) {
      case 'cart': return <UserCart />;
      case 'quotations': return <UserQuotations />;
      case 'request-quote': return <UserRequestQuote />;
      case 'services': return <UserServiceRequests />;
      case 'new-service': return <UserNewServiceRequest />;
      case 'learning': return <UserLearningCenter />;
      case 'settings': return <UserProfileSettings />;
      default: return <UserOverview />;
    }
  };

  return (
    <DashboardLayout
      navItems={navItems}
      title={displayName}
      subtitle={user.email || ''}
      onSignOut={handleSignOut}
      headerExtra={
        <h2 className="font-display font-semibold text-foreground capitalize">
          {tab === 'overview' ? `Welcome, ${displayName}` : tab.replace('-', ' ')}
        </h2>
      }
    >
      {renderContent()}
    </DashboardLayout>
  );
};

export default UserDashboard;

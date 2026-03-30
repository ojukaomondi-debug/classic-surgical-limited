import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ShoppingBag, FileText, Wrench, Bell } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';
import { useCartStore } from '@/stores/cartStore';

const UserOverview = () => {
  const { items } = useCartStore();
  const [quotationCount, setQuotationCount] = useState(0);
  const [serviceCount, setServiceCount] = useState(0);
  const [unreadNotifications, setUnreadNotifications] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      const [qRes, sRes, nRes] = await Promise.all([
        supabase.from('quotation_requests').select('id', { count: 'exact', head: true }),
        supabase.from('service_requests').select('id', { count: 'exact', head: true }),
        supabase.from('notifications').select('id', { count: 'exact', head: true }).eq('read', false),
      ]);
      setQuotationCount(qRes.count || 0);
      setServiceCount(sRes.count || 0);
      setUnreadNotifications(nRes.count || 0);
    };
    fetchCounts();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground text-sm mt-1">Your activity summary</p>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Cart Items" value={items.length} icon={<ShoppingBag size={22} />} variant="primary" />
        <StatCard label="Quotations" value={quotationCount} icon={<FileText size={22} />} variant="accent" />
        <StatCard label="Service Requests" value={serviceCount} icon={<Wrench size={22} />} variant="primary" />
        <StatCard label="Notifications" value={unreadNotifications} icon={<Bell size={22} />} variant="muted" />
      </div>
    </div>
  );
};

export default UserOverview;

import { Users, Package, ClipboardList, FileText, Wrench, ShieldCheck } from 'lucide-react';
import StatCard from '@/components/dashboard/StatCard';

interface AdminOverviewProps {
  userCount: number;
  productCount: number;
  quotationCount: number;
  serviceCount: number;
  adminCount: number;
}

const AdminOverview = ({ userCount, productCount, quotationCount, serviceCount, adminCount }: AdminOverviewProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Dashboard Overview</h2>
        <p className="text-muted-foreground text-sm mt-1">Quick statistics and system summary</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <StatCard label="Total Users" value={userCount} icon={<Users size={22} />} variant="primary" />
        <StatCard label="Products" value={productCount} icon={<Package size={22} />} variant="accent" />
        <StatCard label="Quotation Requests" value={quotationCount} icon={<FileText size={22} />} variant="primary" />
        <StatCard label="Service Requests" value={serviceCount} icon={<Wrench size={22} />} variant="accent" />
        <StatCard label="Admin Users" value={adminCount} icon={<ShieldCheck size={22} />} variant="muted" />
      </div>
    </div>
  );
};

export default AdminOverview;

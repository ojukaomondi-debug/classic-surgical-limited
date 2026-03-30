import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Wrench } from 'lucide-react';
import EmptyState from '@/components/dashboard/EmptyState';

interface ServiceRequest {
  id: string;
  service_type: string;
  title: string;
  description: string | null;
  status: string;
  assigned_technician: string | null;
  priority: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-muted text-muted-foreground',
};

const serviceTypeLabels: Record<string, string> = {
  installation: 'Installation',
  maintenance: 'Maintenance',
  consultation: 'Consultation',
  biomedical_support: 'Biomedical Support',
  laboratory_setup: 'Lab Setup',
};

const UserServiceRequests = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('service_requests').select('*').order('created_at', { ascending: false });
      setRequests(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-20 rounded-lg bg-muted/50 animate-pulse" />)}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">My Service Requests</h2>
        <p className="text-muted-foreground text-sm mt-1">Track your technical service requests</p>
      </div>

      {requests.length === 0 ? (
        <Card><CardContent className="py-0"><EmptyState icon={<Wrench size={28} className="text-muted-foreground" />} title="No Service Requests" description="Submit a service request for equipment installation, maintenance, or support." /></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {requests.map((r) => (
            <Card key={r.id} className="border-border shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-foreground">{r.title}</h3>
                      <Badge variant="outline" className="text-xs">{serviceTypeLabels[r.service_type] || r.service_type}</Badge>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[r.status]}`}>{r.status.replace('_', ' ')}</span>
                    </div>
                    {r.description && <p className="text-sm text-muted-foreground mt-1">{r.description}</p>}
                    {r.assigned_technician && (
                      <p className="text-sm text-foreground mt-2">Technician: <span className="font-medium">{r.assigned_technician}</span></p>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0">{new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserServiceRequests;

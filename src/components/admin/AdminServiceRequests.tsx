import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Wrench } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/dashboard/EmptyState';

interface ServiceRequest {
  id: string;
  user_id: string;
  service_type: string;
  title: string;
  description: string | null;
  status: string;
  assigned_technician: string | null;
  priority: string;
  created_at: string;
}

const priorityColors: Record<string, string> = {
  low: 'bg-muted text-muted-foreground',
  medium: 'bg-yellow-100 text-yellow-800',
  high: 'bg-orange-100 text-orange-800',
  urgent: 'bg-red-100 text-red-800',
};

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  assigned: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-indigo-100 text-indigo-800',
  completed: 'bg-green-100 text-green-800',
  cancelled: 'bg-muted text-muted-foreground',
};

const AdminServiceRequests = () => {
  const [requests, setRequests] = useState<ServiceRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [techInputs, setTechInputs] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => { fetchRequests(); }, []);

  const fetchRequests = async () => {
    const { data } = await supabase.from('service_requests').select('*').order('created_at', { ascending: false });
    setRequests(data || []);
    setLoading(false);
  };

  const updateRequest = async (id: string, updates: Record<string, unknown>) => {
    const { error } = await supabase.from('service_requests').update(updates).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Updated' });
      fetchRequests();
    }
  };

  const assignTechnician = (id: string) => {
    const tech = techInputs[id];
    if (tech) {
      updateRequest(id, { assigned_technician: tech, status: 'assigned' });
      setTechInputs({ ...techInputs, [id]: '' });
    }
  };

  const serviceTypeLabels: Record<string, string> = {
    installation: 'Installation',
    maintenance: 'Maintenance',
    consultation: 'Consultation',
    biomedical_support: 'Biomedical Support',
    laboratory_setup: 'Lab Setup',
  };

  if (loading) return <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 rounded-lg bg-muted/50 animate-pulse" />)}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Service Requests</h2>
        <p className="text-muted-foreground text-sm mt-1">Manage technical service and installation requests</p>
      </div>

      {requests.length === 0 ? (
        <Card><CardContent className="py-0"><EmptyState icon={<Wrench size={28} className="text-muted-foreground" />} title="No Service Requests" description="Service requests from users will appear here." /></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {requests.map((r) => (
            <Card key={r.id} className="border-border shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col gap-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="font-display font-semibold text-foreground">{r.title}</h3>
                      <div className="flex items-center gap-2 mt-1 flex-wrap">
                        <Badge variant="outline" className="text-xs">{serviceTypeLabels[r.service_type] || r.service_type}</Badge>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${priorityColors[r.priority]}`}>{r.priority}</span>
                        <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[r.status]}`}>{r.status.replace('_', ' ')}</span>
                      </div>
                    </div>
                    <Select value={r.status} onValueChange={(v) => updateRequest(r.id, { status: v })}>
                      <SelectTrigger className="w-36 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="assigned">Assigned</SelectItem>
                        <SelectItem value="in_progress">In Progress</SelectItem>
                        <SelectItem value="completed">Completed</SelectItem>
                        <SelectItem value="cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  {r.description && <p className="text-sm text-muted-foreground">{r.description}</p>}
                  <div className="flex items-center gap-2">
                    <Input
                      placeholder="Assign technician..."
                      value={techInputs[r.id] || r.assigned_technician || ''}
                      onChange={(e) => setTechInputs({ ...techInputs, [r.id]: e.target.value })}
                      className="h-9 max-w-xs"
                    />
                    <button onClick={() => assignTechnician(r.id)} className="text-xs text-primary hover:underline font-medium">
                      Assign
                    </button>
                  </div>
                  <p className="text-xs text-muted-foreground">Submitted {new Date(r.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminServiceRequests;

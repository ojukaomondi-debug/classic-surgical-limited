import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { FileText } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/dashboard/EmptyState';

interface Quotation {
  id: string;
  user_id: string;
  product_name: string;
  quantity: number;
  organization: string | null;
  message: string | null;
  status: string;
  admin_response: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  processing: 'bg-blue-100 text-blue-800 border-blue-200',
  approved: 'bg-green-100 text-green-800 border-green-200',
  rejected: 'bg-red-100 text-red-800 border-red-200',
  delivered: 'bg-primary/10 text-primary border-primary/20',
};

const AdminQuotations = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);
  const [respondingTo, setRespondingTo] = useState<string | null>(null);
  const [responseText, setResponseText] = useState('');
  const { toast } = useToast();

  useEffect(() => {
    fetchQuotations();
  }, []);

  const fetchQuotations = async () => {
    const { data } = await supabase.from('quotation_requests').select('*').order('created_at', { ascending: false });
    setQuotations(data || []);
    setLoading(false);
  };

  const updateStatus = async (id: string, status: string) => {
    const updates: Record<string, unknown> = { status };
    if (respondingTo === id && responseText) {
      updates.admin_response = responseText;
    }
    const { error } = await supabase.from('quotation_requests').update(updates).eq('id', id);
    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Updated', description: `Quotation status changed to ${status}` });
      setRespondingTo(null);
      setResponseText('');
      fetchQuotations();
    }
  };

  if (loading) return <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 rounded-lg bg-muted/50 animate-pulse" />)}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Quotation Management</h2>
        <p className="text-muted-foreground text-sm mt-1">Review and respond to quotation requests</p>
      </div>

      {quotations.length === 0 ? (
        <Card><CardContent className="py-0"><EmptyState icon={<FileText size={28} className="text-muted-foreground" />} title="No Quotation Requests" description="Quotation requests from users will appear here." /></CardContent></Card>
      ) : (
        <div className="space-y-4">
          {quotations.map((q) => (
            <Card key={q.id} className="border-border shadow-sm">
              <CardContent className="pt-6">
                <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-display font-semibold text-foreground">{q.product_name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[q.status] || ''}`}>
                        {q.status}
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p>Quantity: <span className="text-foreground font-medium">{q.quantity}</span></p>
                      {q.organization && <p>Organization: <span className="text-foreground">{q.organization}</span></p>}
                      {q.message && <p>Message: {q.message}</p>}
                      <p className="text-xs">Submitted {new Date(q.created_at).toLocaleDateString()}</p>
                    </div>
                    {q.admin_response && (
                      <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-xs font-medium text-primary mb-1">Admin Response</p>
                        <p className="text-sm text-foreground">{q.admin_response}</p>
                      </div>
                    )}
                    {respondingTo === q.id && (
                      <Textarea
                        placeholder="Write a response..."
                        value={responseText}
                        onChange={(e) => setResponseText(e.target.value)}
                        className="mt-2"
                        rows={3}
                      />
                    )}
                  </div>
                  <div className="flex items-center gap-2 shrink-0">
                    <Button variant="outline" size="sm" onClick={() => setRespondingTo(respondingTo === q.id ? null : q.id)}>
                      {respondingTo === q.id ? 'Cancel' : 'Respond'}
                    </Button>
                    <Select value={q.status} onValueChange={(v) => updateStatus(q.id, v)}>
                      <SelectTrigger className="w-32 h-9">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="pending">Pending</SelectItem>
                        <SelectItem value="processing">Processing</SelectItem>
                        <SelectItem value="approved">Approved</SelectItem>
                        <SelectItem value="rejected">Rejected</SelectItem>
                        <SelectItem value="delivered">Delivered</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminQuotations;

import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { FileText } from 'lucide-react';
import EmptyState from '@/components/dashboard/EmptyState';

interface Quotation {
  id: string;
  product_name: string;
  quantity: number;
  organization: string | null;
  status: string;
  admin_response: string | null;
  created_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-blue-100 text-blue-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
  delivered: 'bg-primary/10 text-primary',
};

const UserQuotations = () => {
  const [quotations, setQuotations] = useState<Quotation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('quotation_requests').select('*').order('created_at', { ascending: false });
      setQuotations(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="space-y-3">{[1, 2].map(i => <div key={i} className="h-20 rounded-lg bg-muted/50 animate-pulse" />)}</div>;

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">My Quotations</h2>
        <p className="text-muted-foreground text-sm mt-1">Track your quotation requests and responses</p>
      </div>

      {quotations.length === 0 ? (
        <Card><CardContent className="py-0"><EmptyState icon={<FileText size={28} className="text-muted-foreground" />} title="No Quotations Yet" description="Request a quotation from the shop or products page." /></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {quotations.map((q) => (
            <Card key={q.id} className="border-border shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-foreground">{q.product_name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${statusColors[q.status]}`}>{q.status}</span>
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">Qty: {q.quantity} {q.organization && `• ${q.organization}`}</p>
                    {q.admin_response && (
                      <div className="mt-2 p-3 rounded-lg bg-primary/5 border border-primary/10">
                        <p className="text-xs font-medium text-primary mb-1">Response</p>
                        <p className="text-sm text-foreground">{q.admin_response}</p>
                      </div>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground shrink-0">{new Date(q.created_at).toLocaleDateString()}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default UserQuotations;

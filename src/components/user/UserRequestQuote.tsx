import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { FileText, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const UserRequestQuote = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ product_name: '', quantity: '1', organization: '', message: '' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.product_name.trim()) { toast({ title: 'Product name is required', variant: 'destructive' }); return; }

    setSubmitting(true);
    const { error } = await supabase.from('quotation_requests').insert({
      user_id: user.id,
      product_name: form.product_name.trim(),
      quantity: parseInt(form.quantity) || 1,
      organization: form.organization.trim() || null,
      message: form.message.trim() || null,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Quote Requested!', description: 'We will get back to you shortly.' });
      setForm({ product_name: '', quantity: '1', organization: '', message: '' });
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Request a Quote</h2>
        <p className="text-muted-foreground text-sm mt-1">Submit a quotation request for medical equipment</p>
      </div>

      <Card className="border-border shadow-sm max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <FileText size={20} className="text-primary" /> Quotation Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Product / Equipment Name *</Label>
                <Input value={form.product_name} onChange={(e) => setForm({ ...form, product_name: e.target.value })} placeholder="e.g. Digital Thermometer" required />
              </div>
              <div className="space-y-2">
                <Label>Quantity</Label>
                <Input type="number" min="1" value={form.quantity} onChange={(e) => setForm({ ...form, quantity: e.target.value })} />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Organization / Hospital Name</Label>
              <Input value={form.organization} onChange={(e) => setForm({ ...form, organization: e.target.value })} placeholder="e.g. Nairobi General Hospital" />
            </div>
            <div className="space-y-2">
              <Label>Additional Message</Label>
              <Textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} placeholder="Any specific requirements or details..." rows={4} />
            </div>
            <Button type="submit" disabled={submitting} className="gap-2">
              <Send size={16} />
              {submitting ? 'Submitting...' : 'Submit Request'}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default UserRequestQuote;

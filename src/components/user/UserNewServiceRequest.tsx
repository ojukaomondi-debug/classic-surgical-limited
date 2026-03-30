import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Wrench, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/hooks/useAuth';

const UserNewServiceRequest = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [form, setForm] = useState({ title: '', service_type: 'installation', description: '', priority: 'medium' });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    if (!form.title.trim()) { toast({ title: 'Title is required', variant: 'destructive' }); return; }

    setSubmitting(true);
    const { error } = await supabase.from('service_requests').insert({
      user_id: user.id,
      title: form.title.trim(),
      service_type: form.service_type,
      description: form.description.trim() || null,
      priority: form.priority,
    });

    if (error) {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    } else {
      toast({ title: 'Request Submitted!', description: 'Our team will review your request.' });
      setForm({ title: '', service_type: 'installation', description: '', priority: 'medium' });
    }
    setSubmitting(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Request Service</h2>
        <p className="text-muted-foreground text-sm mt-1">Submit a technical service or support request</p>
      </div>

      <Card className="border-border shadow-sm max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg font-display">
            <Wrench size={20} className="text-primary" /> Service Request Form
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Title *</Label>
              <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="e.g. ICU Equipment Installation" required />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Service Type</Label>
                <Select value={form.service_type} onValueChange={(v) => setForm({ ...form, service_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="installation">Equipment Installation</SelectItem>
                    <SelectItem value="maintenance">Equipment Maintenance</SelectItem>
                    <SelectItem value="consultation">Hospital Setup Consultation</SelectItem>
                    <SelectItem value="biomedical_support">Biomedical Support</SelectItem>
                    <SelectItem value="laboratory_setup">Laboratory Setup</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Priority</Label>
                <Select value={form.priority} onValueChange={(v) => setForm({ ...form, priority: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Describe your service needs in detail..." rows={4} />
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

export default UserNewServiceRequest;

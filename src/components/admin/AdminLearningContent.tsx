import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { BookOpen, Plus, Trash2, Edit } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import EmptyState from '@/components/dashboard/EmptyState';

interface LearningItem {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  content_url: string | null;
  content_body: string | null;
  category: string | null;
  published: boolean;
  created_at: string;
}

const AdminLearningContent = () => {
  const [items, setItems] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState({ title: '', description: '', content_type: 'article', content_url: '', content_body: '', category: '', published: false });
  const { toast } = useToast();

  useEffect(() => { fetchItems(); }, []);

  const fetchItems = async () => {
    const { data } = await supabase.from('learning_content').select('*').order('created_at', { ascending: false });
    setItems(data || []);
    setLoading(false);
  };

  const resetForm = () => {
    setForm({ title: '', description: '', content_type: 'article', content_url: '', content_body: '', category: '', published: false });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    if (!form.title) { toast({ title: 'Title is required', variant: 'destructive' }); return; }

    const payload = {
      title: form.title,
      description: form.description || null,
      content_type: form.content_type,
      content_url: form.content_url || null,
      content_body: form.content_body || null,
      category: form.category || null,
      published: form.published,
    };

    if (editingId) {
      const { error } = await supabase.from('learning_content').update(payload).eq('id', editingId);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Content updated' });
    } else {
      const { error } = await supabase.from('learning_content').insert(payload);
      if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
      toast({ title: 'Content added' });
    }
    resetForm();
    fetchItems();
  };

  const handleEdit = (item: LearningItem) => {
    setForm({
      title: item.title,
      description: item.description || '',
      content_type: item.content_type,
      content_url: item.content_url || '',
      content_body: item.content_body || '',
      category: item.category || '',
      published: item.published,
    });
    setEditingId(item.id);
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('learning_content').delete().eq('id', id);
    if (error) { toast({ title: 'Error', description: error.message, variant: 'destructive' }); return; }
    toast({ title: 'Content deleted' });
    fetchItems();
  };

  const contentTypeLabels: Record<string, string> = { article: 'Article', video: 'Video', manual: 'Manual', guide: 'Guide' };

  if (loading) return <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 rounded-lg bg-muted/50 animate-pulse" />)}</div>;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold text-foreground">Learning Content</h2>
          <p className="text-muted-foreground text-sm mt-1">Manage educational resources and training materials</p>
        </div>
        <Button onClick={() => { resetForm(); setShowForm(!showForm); }} className="gap-2">
          <Plus size={16} />
          Add Content
        </Button>
      </div>

      {showForm && (
        <Card className="border-primary/20 shadow-md">
          <CardHeader><CardTitle className="text-lg font-display">{editingId ? 'Edit' : 'Add'} Content</CardTitle></CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Title</Label>
                <Input value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Content title" />
              </div>
              <div className="space-y-2">
                <Label>Type</Label>
                <Select value={form.content_type} onValueChange={(v) => setForm({ ...form, content_type: v })}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>
                    <SelectItem value="article">Article</SelectItem>
                    <SelectItem value="video">Video</SelectItem>
                    <SelectItem value="manual">Manual</SelectItem>
                    <SelectItem value="guide">Guide</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Category</Label>
                <Input value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} placeholder="e.g. Equipment Maintenance" />
              </div>
              <div className="space-y-2">
                <Label>URL (for videos/manuals)</Label>
                <Input value={form.content_url} onChange={(e) => setForm({ ...form, content_url: e.target.value })} placeholder="https://..." />
              </div>
            </div>
            <div className="space-y-2">
              <Label>Description</Label>
              <Textarea value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Brief description" rows={2} />
            </div>
            <div className="space-y-2">
              <Label>Content Body</Label>
              <Textarea value={form.content_body} onChange={(e) => setForm({ ...form, content_body: e.target.value })} placeholder="Full content (for articles)" rows={5} />
            </div>
            <div className="flex items-center gap-2">
              <Switch checked={form.published} onCheckedChange={(v) => setForm({ ...form, published: v })} />
              <Label>Published</Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSubmit}>{editingId ? 'Update' : 'Save'}</Button>
              <Button variant="outline" onClick={resetForm}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      {items.length === 0 && !showForm ? (
        <Card><CardContent className="py-0"><EmptyState icon={<BookOpen size={28} className="text-muted-foreground" />} title="No Learning Content" description="Add articles, videos, and guides for your users." /></CardContent></Card>
      ) : (
        <div className="space-y-3">
          {items.map((item) => (
            <Card key={item.id} className="border-border shadow-sm">
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-medium text-foreground">{item.title}</h3>
                      <Badge variant="outline" className="text-xs">{contentTypeLabels[item.content_type]}</Badge>
                      {item.category && <Badge variant="secondary" className="text-xs">{item.category}</Badge>}
                      <Badge variant={item.published ? 'default' : 'secondary'} className="text-xs">
                        {item.published ? 'Published' : 'Draft'}
                      </Badge>
                    </div>
                    {item.description && <p className="text-sm text-muted-foreground mt-1">{item.description}</p>}
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <Button variant="ghost" size="sm" onClick={() => handleEdit(item)}><Edit size={14} /></Button>
                    <Button variant="ghost" size="sm" onClick={() => handleDelete(item.id)} className="text-destructive hover:text-destructive"><Trash2 size={14} /></Button>
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

export default AdminLearningContent;

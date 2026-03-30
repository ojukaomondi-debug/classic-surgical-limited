import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { BookOpen, ExternalLink, Play, FileDown } from 'lucide-react';
import EmptyState from '@/components/dashboard/EmptyState';

interface LearningItem {
  id: string;
  title: string;
  description: string | null;
  content_type: string;
  content_url: string | null;
  content_body: string | null;
  category: string | null;
}

const typeIcons: Record<string, React.ReactNode> = {
  article: <BookOpen size={16} />,
  video: <Play size={16} />,
  manual: <FileDown size={16} />,
  guide: <BookOpen size={16} />,
};

const UserLearningCenter = () => {
  const [items, setItems] = useState<LearningItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    const fetch = async () => {
      const { data } = await supabase.from('learning_content').select('*').eq('published', true).order('created_at', { ascending: false });
      setItems(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  if (loading) return <div className="space-y-3">{[1, 2, 3].map(i => <div key={i} className="h-20 rounded-lg bg-muted/50 animate-pulse" />)}</div>;

  const categories = [...new Set(items.map(i => i.category).filter(Boolean))];

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold text-foreground">Learning Center</h2>
        <p className="text-muted-foreground text-sm mt-1">Training articles, guides, videos, and product manuals</p>
      </div>

      {items.length === 0 ? (
        <Card><CardContent className="py-0"><EmptyState icon={<BookOpen size={28} className="text-muted-foreground" />} title="No Content Yet" description="Learning materials will appear here once published." /></CardContent></Card>
      ) : (
        <>
          {categories.length > 0 && (
            <div className="flex gap-2 flex-wrap">
              {categories.map((cat) => (
                <Badge key={cat} variant="secondary" className="text-xs">{cat}</Badge>
              ))}
            </div>
          )}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <Card key={item.id} className="border-border shadow-sm hover:shadow-md transition-shadow cursor-pointer" onClick={() => setExpandedId(expandedId === item.id ? null : item.id)}>
                <CardContent className="pt-6">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      {typeIcons[item.content_type] || <BookOpen size={16} />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-medium text-foreground text-sm line-clamp-2">{item.title}</h3>
                      {item.description && <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{item.description}</p>}
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant="outline" className="text-xs capitalize">{item.content_type}</Badge>
                        {item.category && <Badge variant="secondary" className="text-xs">{item.category}</Badge>}
                      </div>
                      {expandedId === item.id && (
                        <div className="mt-3 space-y-2">
                          {item.content_body && <p className="text-sm text-foreground whitespace-pre-wrap">{item.content_body}</p>}
                          {item.content_url && (
                            <a href={item.content_url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-sm text-primary hover:underline">
                              Open Resource <ExternalLink size={12} />
                            </a>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default UserLearningCenter;

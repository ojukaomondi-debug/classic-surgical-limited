import { ReactNode } from 'react';

interface EmptyStateProps {
  icon: ReactNode;
  title: string;
  description: string;
  action?: ReactNode;
}

const EmptyState = ({ icon, title, description, action }: EmptyStateProps) => (
  <div className="text-center py-12">
    <div className="w-16 h-16 rounded-2xl bg-muted/50 flex items-center justify-center mx-auto mb-4">
      {icon}
    </div>
    <h3 className="font-display text-lg font-semibold text-foreground mb-1">{title}</h3>
    <p className="text-muted-foreground text-sm max-w-md mx-auto mb-4">{description}</p>
    {action}
  </div>
);

export default EmptyState;

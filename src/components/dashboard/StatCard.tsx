import { ReactNode } from 'react';
import { Card, CardContent } from '@/components/ui/card';

interface StatCardProps {
  label: string;
  value: string | number;
  icon: ReactNode;
  trend?: string;
  variant?: 'primary' | 'accent' | 'muted';
}

const StatCard = ({ label, value, icon, trend, variant = 'primary' }: StatCardProps) => {
  const bgMap = {
    primary: 'bg-primary/10',
    accent: 'bg-accent/10',
    muted: 'bg-muted',
  };
  const textMap = {
    primary: 'text-primary',
    accent: 'text-accent',
    muted: 'text-muted-foreground',
  };

  return (
    <Card className="border-border shadow-sm hover:shadow-md transition-shadow">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-muted-foreground">{label}</p>
            <p className="text-3xl font-display font-bold text-foreground mt-1">{value}</p>
            {trend && <p className="text-xs text-muted-foreground mt-1">{trend}</p>}
          </div>
          <div className={`w-12 h-12 rounded-xl ${bgMap[variant]} flex items-center justify-center`}>
            <span className={textMap[variant]}>{icon}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default StatCard;

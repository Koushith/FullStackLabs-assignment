import type { LucideIcon } from 'lucide-react';
import { Card } from './ui/card';

interface FeatureCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
}

export function FeatureCard({ icon: Icon, title, description }: FeatureCardProps) {
  return (
    <Card className="p-5 text-center space-y-3">
      <div className="w-12 h-12 mx-auto rounded-xl bg-secondary flex items-center justify-center">
        <Icon className="w-6 h-6" />
      </div>
      <h3 className="font-semibold">{title}</h3>
      <p className="text-sm text-muted-foreground">{description}</p>
    </Card>
  );
}

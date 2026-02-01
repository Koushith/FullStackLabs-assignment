import type { LucideIcon } from 'lucide-react';
import { Card } from './ui/card';

interface StatCardProps {
  icon: LucideIcon;
  value: string | number;
  label: string;
  className?: string;
}

export function StatCard({ icon: Icon, value, label, className = '' }: StatCardProps) {
  return (
    <Card className={`p-4 ${className}`}>
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-secondary flex items-center justify-center">
          <Icon className="w-5 h-5" />
        </div>
        <div>
          <div className="text-2xl font-bold">{value}</div>
          <div className="text-sm text-muted-foreground">{label}</div>
        </div>
      </div>
    </Card>
  );
}

// Simpler version for compact stats
interface CompactStatProps {
  value: string | number;
  label: string;
}

export function CompactStat({ value, label }: CompactStatProps) {
  return (
    <Card className="p-3 sm:p-4 text-center">
      <div className="text-xl sm:text-2xl font-bold">{value}</div>
      <div className="text-xs sm:text-sm text-muted-foreground">{label}</div>
    </Card>
  );
}

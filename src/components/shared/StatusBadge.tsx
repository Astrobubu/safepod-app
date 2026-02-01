'use client';

import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type StatusType = 'home' | 'en_route_to_pod' | 'at_pod' | 'on_shuttle' | 'at_school' | 'picked_up';

interface StatusBadgeProps {
  status: StatusType;
  podName?: string;
  shuttleName?: string;
  className?: string;
}

const statusConfig: Record<StatusType, { label: string; variant: 'default' | 'secondary' | 'destructive' | 'outline'; color: string }> = {
  home: {
    label: 'At Home',
    variant: 'secondary',
    color: 'bg-slate-100 text-slate-700 border-slate-200',
  },
  en_route_to_pod: {
    label: 'En Route to Pod',
    variant: 'outline',
    color: 'bg-blue-50 text-blue-700 border-blue-200',
  },
  at_pod: {
    label: 'At Pod',
    variant: 'default',
    color: 'bg-amber-100 text-amber-800 border-amber-200',
  },
  on_shuttle: {
    label: 'On Shuttle',
    variant: 'default',
    color: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  },
  at_school: {
    label: 'At School',
    variant: 'default',
    color: 'bg-green-100 text-green-800 border-green-200',
  },
  picked_up: {
    label: 'Picked Up',
    variant: 'secondary',
    color: 'bg-purple-100 text-purple-700 border-purple-200',
  },
};

export function StatusBadge({ status, podName, shuttleName, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  let label = config.label;
  if (status === 'at_pod' && podName) {
    label = `At ${podName}`;
  } else if (status === 'on_shuttle' && shuttleName) {
    label = `On ${shuttleName}`;
  }

  return (
    <Badge
      variant={config.variant}
      className={cn(config.color, 'font-medium', className)}
    >
      {label}
    </Badge>
  );
}

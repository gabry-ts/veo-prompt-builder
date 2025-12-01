import { AlertCircle, AlertTriangle, Info } from 'lucide-react';

interface CompactBadgeProps {
  count: number;
  type: 'error' | 'warning' | 'info';
  label: string;
}

export function CompactBadge({ count, type, label }: CompactBadgeProps): JSX.Element {
  const config = {
    error: {
      Icon: AlertCircle,
      classes: 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-red-300 dark:border-red-700',
    },
    warning: {
      Icon: AlertTriangle,
      classes: 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-400 border-yellow-300 dark:border-yellow-700',
    },
    info: {
      Icon: Info,
      classes: 'bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 border-blue-300 dark:border-blue-700',
    },
  };

  const { Icon, classes } = config[type];

  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold border ${classes} transition-all duration-300 hover:scale-105`}>
      <Icon className="w-3.5 h-3.5" />
      {count} {label}
      {count > 1 ? 's' : ''}
    </span>
  );
}

export function buildSummaryText(
  errorCount: number,
  warningCount: number,
  infoCount: number,
): string {
  const parts: string[] = [];

  if (errorCount > 0) {
    parts.push(`${errorCount} error${errorCount > 1 ? 's' : ''} must be fixed`);
  }

  if (warningCount > 0) {
    parts.push(`${warningCount} suggestion${warningCount > 1 ? 's' : ''}`);
  }

  if (infoCount > 0 && errorCount === 0 && warningCount === 0) {
    parts.push(`${infoCount} tip${infoCount > 1 ? 's' : ''}`);
  }

  return parts.join(' • ');
}

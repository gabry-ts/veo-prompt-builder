import type { LucideIcon } from 'lucide-react';
import type { ReactNode } from 'react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: {
    label: string;
    onClick: () => void;
    icon?: LucideIcon;
  };
  secondaryAction?: {
    label: string;
    onClick: () => void;
  };
  illustration?: ReactNode;
}

function EmptyState({
  icon: iconComponent,
  title,
  description,
  action,
  secondaryAction,
  illustration,
}: EmptyStateProps): JSX.Element {
  const IconComponent = iconComponent;
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 animate-fade-in">
      <div className="glass-card rounded-3xl p-12 max-w-2xl text-center card-3d">
        {/* Icon or Illustration */}
        {illustration !== undefined ? (
          illustration
        ) : (
          <div className="relative mx-auto w-24 h-24 mb-6">
            <div className="absolute inset-0 bg-gradient-to-br from-primary-500/20 to-accent-500/20 rounded-full blur-2xl animate-pulse" />
            <div className="relative glass-card rounded-full p-6 card-3d">
              <IconComponent
                className="w-12 h-12 text-primary-600 dark:text-primary-400"
                strokeWidth={1.5}
              />
            </div>
          </div>
        )}

        {/* Title */}
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>

        {/* Description */}
        <p className="text-gray-600 dark:text-gray-400 mb-8 max-w-md mx-auto leading-relaxed">
          {description}
        </p>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          {action && (
            <button onClick={action.onClick} className="btn-premium inline-flex items-center gap-2">
              {action.icon && <action.icon className="w-5 h-5" />}
              {action.label}
            </button>
          )}
          {secondaryAction && (
            <button onClick={secondaryAction.onClick} className="btn-premium-outline">
              {secondaryAction.label}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default EmptyState;

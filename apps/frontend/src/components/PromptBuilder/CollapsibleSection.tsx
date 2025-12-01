import { useState, type ReactNode } from 'react';
import { ChevronDown, Circle, CircleDot, CheckCircle2, Sparkles } from 'lucide-react';

interface CollapsibleSectionProps {
  title: string;
  icon?: string;
  children: ReactNode;
  defaultOpen?: boolean;
  completionStatus?: 'empty' | 'partial' | 'complete';
  required?: boolean;
}

function CollapsibleSection({
  title,
  icon,
  children,
  defaultOpen = true,
  completionStatus = 'empty',
  required = false,
}: CollapsibleSectionProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  const statusConfig = {
    empty: {
      icon: Circle,
      color: 'text-gray-400 dark:text-gray-500',
      bgColor: 'bg-gray-100 dark:bg-gray-800',
      borderColor: 'border-gray-200 dark:border-gray-700',
    },
    partial: {
      icon: CircleDot,
      color: 'text-yellow-500 dark:text-yellow-400',
      bgColor: 'bg-yellow-50 dark:bg-yellow-900/20',
      borderColor: 'border-yellow-200 dark:border-yellow-700/50',
    },
    complete: {
      icon: CheckCircle2,
      color: 'text-green-500 dark:text-green-400',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      borderColor: 'border-green-200 dark:border-green-700/50',
    },
  };

  const StatusIcon = statusConfig[completionStatus].icon;

  return (
    <div className="glass-section card-3d animate-scale-in group">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-6 py-5 flex items-center justify-between hover:bg-white/30 dark:hover:bg-gray-800/30 transition-all duration-300 relative overflow-hidden"
      >
        {/* Subtle gradient overlay on hover */}
        <div className="absolute inset-0 bg-gradient-to-r from-primary-500/0 via-primary-500/5 to-accent-500/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        <div className="flex items-center gap-4 relative z-10">
          {/* Icon with glow effect */}
          {icon && (
            <div className="icon-glow">
              <span className="text-3xl filter drop-shadow-lg transition-transform duration-300 group-hover:scale-110">
                {icon}
              </span>
            </div>
          )}

          {/* Title with gradient on complete */}
          <h3
            className={`text-lg font-bold transition-all duration-300 ${
              completionStatus === 'complete'
                ? 'gradient-text'
                : 'text-gray-900 dark:text-white group-hover:text-primary-600 dark:group-hover:text-primary-400'
            }`}
          >
            {title}
            {required && (
              <span className="ml-2 inline-flex items-center">
                <Sparkles className="w-4 h-4 text-accent-500 animate-pulse" />
              </span>
            )}
          </h3>
        </div>

        <div className="flex items-center gap-4 relative z-10">
          {/* Status indicator with glassmorphism */}
          <div
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full backdrop-blur-md border ${statusConfig[completionStatus].bgColor} ${statusConfig[completionStatus].borderColor} transition-all duration-300 hover:scale-105`}
          >
            <StatusIcon className={`w-4 h-4 ${statusConfig[completionStatus].color}`} />
            <span className={`text-xs font-semibold ${statusConfig[completionStatus].color}`}>
              {completionStatus === 'empty' && 'Empty'}
              {completionStatus === 'partial' && 'Partial'}
              {completionStatus === 'complete' && 'Complete'}
            </span>
          </div>

          {/* Chevron with smooth rotation */}
          <ChevronDown
            className={`w-5 h-5 text-gray-500 dark:text-gray-400 transition-all duration-400 ${
              isOpen ? 'rotate-180 text-primary-500' : ''
            }`}
          />
        </div>
      </button>

      {/* Content with slide animation */}
      {isOpen && (
        <div className="px-6 py-5 border-t border-white/20 dark:border-gray-700/30 bg-gradient-to-b from-white/20 to-transparent dark:from-gray-800/20 animate-slide-down">
          {children}
        </div>
      )}
    </div>
  );
}

export default CollapsibleSection;

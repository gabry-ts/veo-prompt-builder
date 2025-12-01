import {
  Settings,
  Camera,
  Pencil,
  Film,
  Volume2,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Circle,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

export interface TabDefinition {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface TabNavigationProps {
  tabs: TabDefinition[];
  activeTab: string;
  onTabChange: (tabId: string) => void;
  validationStatus?: Record<string, 'valid' | 'invalid' | 'incomplete'>;
}

const getStatusIcon = (status: 'valid' | 'invalid' | 'incomplete' | undefined): LucideIcon => {
  switch (status) {
    case 'valid':
      return CheckCircle2;
    case 'invalid':
      return AlertCircle;
    case 'incomplete':
    default:
      return Circle;
  }
};

const getStatusColor = (status: 'valid' | 'invalid' | 'incomplete' | undefined): string => {
  switch (status) {
    case 'valid':
      return 'text-green-500';
    case 'invalid':
      return 'text-red-500';
    case 'incomplete':
    default:
      return 'text-gray-400';
  }
};

function TabNavigation({
  tabs,
  activeTab,
  onTabChange,
  validationStatus = {},
}: TabNavigationProps): JSX.Element {
  return (
    <div className="glass-card rounded-2xl p-2 mb-6 card-3d">
      <div className="flex overflow-x-auto scrollbar-thin gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          const status = validationStatus[tab.id];
          const StatusIcon = getStatusIcon(status);
          const TabIcon = tab.icon;

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange(tab.id)}
              className={`
                relative flex-shrink-0 flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300
                ${
                  isActive
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/50'
                    : 'glass-card hover:shadow-md text-gray-700 dark:text-gray-300'
                }
              `}
            >
              {/* Tab Icon */}
              <div className="relative">
                <TabIcon className={`w-5 h-5 ${isActive ? 'text-white' : 'text-primary-600'}`} />
                {/* Validation status badge */}
                <div className="absolute -top-1 -right-1">
                  <StatusIcon
                    className={`w-3 h-3 ${isActive ? 'text-white' : getStatusColor(status)}`}
                  />
                </div>
              </div>

              {/* Tab Label */}
              <span className={`font-semibold text-sm ${isActive ? 'text-white' : ''}`}>
                {tab.label}
              </span>

              {/* Active indicator */}
              {isActive && (
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-12 h-1 bg-white rounded-t-full animate-pulse" />
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default TabNavigation;

// Default tabs configuration
export const defaultTabs: TabDefinition[] = [
  { id: 'settings', label: 'Video Settings', icon: Settings },
  { id: 'cinematography', label: 'Cinematography', icon: Camera },
  { id: 'core', label: 'Core Formula', icon: Pencil },
  { id: 'sequence', label: 'Sequence', icon: Film },
  { id: 'audio', label: 'Audio', icon: Volume2 },
  { id: 'advanced', label: 'Advanced', icon: Sparkles },
];

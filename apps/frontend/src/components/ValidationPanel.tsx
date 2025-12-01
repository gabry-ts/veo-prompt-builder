import { useState } from 'react';
import {
  AlertCircle,
  AlertTriangle,
  Info,
  CheckCircle2,
  ChevronDown,
  Sparkles,
} from 'lucide-react';
import type { ValidationResult, ValidationWarning } from '../utils/veoValidation';
import { CompactBadge, buildSummaryText } from './ValidationPanelComponents';

interface ValidationPanelProps {
  result: ValidationResult;
  compact?: boolean;
}

interface ValidationSectionProps {
  title: string;
  Icon: typeof AlertCircle;
  count: number;
  warnings: ValidationWarning[];
  isExpanded: boolean;
  onToggle: () => void;
  colorConfig: {
    bg: string;
    border: string;
    text: string;
    iconColor: string;
  };
}

function ValidationSection({
  title,
  Icon,
  count,
  warnings,
  isExpanded,
  onToggle,
  colorConfig,
}: ValidationSectionProps): JSX.Element {
  return (
    <div className="glass-card rounded-xl overflow-hidden card-3d animate-slide-up">
      <button
        onClick={onToggle}
        className={`w-full flex items-center justify-between p-4 ${colorConfig.bg} hover:opacity-90 transition-all duration-300 group`}
      >
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${colorConfig.bg} ${colorConfig.border} border-2 group-hover:scale-110 transition-transform duration-300`}
          >
            <Icon className={`w-5 h-5 ${colorConfig.iconColor}`} />
          </div>
          <div className="text-left">
            <h4 className={`font-bold ${colorConfig.text} flex items-center gap-2`}>
              {title}
              <span
                className={`px-2 py-0.5 text-xs rounded-full ${colorConfig.bg} ${colorConfig.border} border`}
              >
                {count}
              </span>
            </h4>
            {title.includes('Errors') && (
              <p className="text-xs text-red-600 dark:text-red-400 font-semibold mt-0.5">
                Must fix before export
              </p>
            )}
          </div>
        </div>
        <ChevronDown
          className={`w-5 h-5 ${colorConfig.text} transition-all duration-400 ${isExpanded ? 'rotate-180' : ''}`}
        />
      </button>

      {isExpanded && (
        <div className="p-4 space-y-3 bg-gradient-to-b from-white/50 to-transparent dark:from-gray-800/30 animate-slide-down">
          {warnings.map((warning: ValidationWarning, index: number) => (
            <div
              key={index}
              className={`glass-card p-4 rounded-lg border-l-4 ${colorConfig.border} hover:scale-[1.02] transition-all duration-300`}
            >
              <div className="flex gap-3">
                <div className="flex-1">
                  <p className={`text-sm font-bold ${colorConfig.text} mb-1`}>{warning.field}</p>
                  <p className="text-sm text-gray-700 dark:text-gray-300">{warning.message}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function SuccessMessage(): JSX.Element {
  return (
    <div className="glass-card rounded-2xl p-6 card-3d animate-scale-in">
      <div className="flex items-center gap-4">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500/30 rounded-full blur-xl animate-pulse" />
          <div className="relative bg-gradient-to-br from-green-400 to-emerald-500 p-3 rounded-full">
            <CheckCircle2 className="w-8 h-8 text-white" />
          </div>
        </div>
        <div>
          <h3 className="text-xl font-bold gradient-text flex items-center gap-2">
            Perfect! Validation Passed
            <Sparkles className="w-5 h-5 text-accent-500 animate-pulse" />
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
            Your prompt follows all Veo 3.1 best practices
          </p>
        </div>
      </div>
    </div>
  );
}

function ValidationPanel({ result, compact = false }: ValidationPanelProps): JSX.Element {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    errors: true,
    warnings: true,
    infos: false,
  });

  const toggleSection = (section: string): void => {
    setExpandedSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  if (result.warnings.length === 0) {
    return <SuccessMessage />;
  }

  const errors = result.warnings.filter((w) => w.severity === 'error');
  const warnings = result.warnings.filter((w) => w.severity === 'warning');
  const infos = result.warnings.filter((w) => w.severity === 'info');

  if (compact) {
    return (
      <div className="flex items-center gap-2">
        {errors.length > 0 && <CompactBadge count={errors.length} type="error" label="error" />}
        {warnings.length > 0 && (
          <CompactBadge count={warnings.length} type="warning" label="warning" />
        )}
        {infos.length > 0 && errors.length === 0 && warnings.length === 0 && (
          <CompactBadge count={infos.length} type="info" label="tip" />
        )}
      </div>
    );
  }

  const hasErrors = errors.length > 0;
  const hasWarnings = warnings.length > 0;

  const SummaryIcon = hasErrors ? AlertCircle : hasWarnings ? AlertTriangle : Info;
  const summaryConfig = hasErrors
    ? {
        bg: 'bg-red-50 dark:bg-red-900/20',
        border: 'border-red-300 dark:border-red-700',
        iconBg: 'bg-red-500',
        title: 'Issues Found',
      }
    : hasWarnings
      ? {
          bg: 'bg-yellow-50 dark:bg-yellow-900/20',
          border: 'border-yellow-300 dark:border-yellow-700',
          iconBg: 'bg-yellow-500',
          title: 'Recommendations',
        }
      : {
          bg: 'bg-blue-50 dark:bg-blue-900/20',
          border: 'border-blue-300 dark:border-blue-700',
          iconBg: 'bg-blue-500',
          title: 'Tips & Info',
        };

  return (
    <div className="space-y-4">
      {/* Summary Card */}
      <div
        className={`glass-card rounded-2xl p-5 border-2 ${summaryConfig.bg} ${summaryConfig.border} card-3d animate-scale-in`}
      >
        <div className="flex items-center gap-4">
          <div className="relative">
            <div
              className={`absolute inset-0 ${summaryConfig.iconBg} opacity-30 rounded-full blur-lg`}
            />
            <div className={`relative ${summaryConfig.iconBg} p-3 rounded-full`}>
              <SummaryIcon className="w-6 h-6 text-white" />
            </div>
          </div>
          <div>
            <h3 className="font-bold text-lg text-gray-900 dark:text-white">
              {summaryConfig.title}
            </h3>
            <p className="text-sm text-gray-700 dark:text-gray-300 mt-0.5">
              {buildSummaryText(errors.length, warnings.length, infos.length)}
            </p>
          </div>
        </div>
      </div>

      {/* Errors */}
      {errors.length > 0 && (
        <ValidationSection
          title="Errors"
          Icon={AlertCircle}
          count={errors.length}
          warnings={errors}
          isExpanded={expandedSections.errors ?? true}
          onToggle={() => toggleSection('errors')}
          colorConfig={{
            bg: 'bg-red-50 dark:bg-red-900/20',
            border: 'border-red-500 dark:border-red-600',
            text: 'text-red-900 dark:text-red-100',
            iconColor: 'text-red-600 dark:text-red-400',
          }}
        />
      )}

      {/* Warnings */}
      {warnings.length > 0 && (
        <ValidationSection
          title="Recommendations"
          Icon={AlertTriangle}
          count={warnings.length}
          warnings={warnings}
          isExpanded={expandedSections.warnings ?? true}
          onToggle={() => toggleSection('warnings')}
          colorConfig={{
            bg: 'bg-yellow-50 dark:bg-yellow-900/20',
            border: 'border-yellow-500 dark:border-yellow-600',
            text: 'text-yellow-900 dark:text-yellow-100',
            iconColor: 'text-yellow-600 dark:text-yellow-400',
          }}
        />
      )}

      {/* Info */}
      {infos.length > 0 && (
        <ValidationSection
          title="Tips & Info"
          Icon={Info}
          count={infos.length}
          warnings={infos}
          isExpanded={expandedSections.infos ?? false}
          onToggle={() => toggleSection('infos')}
          colorConfig={{
            bg: 'bg-blue-50 dark:bg-blue-900/20',
            border: 'border-blue-500 dark:border-blue-600',
            text: 'text-blue-900 dark:text-blue-100',
            iconColor: 'text-blue-600 dark:text-blue-400',
          }}
        />
      )}
    </div>
  );
}

export default ValidationPanel;

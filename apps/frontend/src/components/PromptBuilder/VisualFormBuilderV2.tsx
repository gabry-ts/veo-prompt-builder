import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useState, useEffect, useMemo } from 'react';
import type { VeoPromptStructure } from '../../data/veoTemplates';
import { getTabValidationStatus } from '../../utils/validation/tabValidation';
import { validateVeoPrompt } from '../../utils/veoValidation';
import AdvancedStep from './AdvancedStep';
import AudioStep from './AudioStep';
import CinematographyStep from './CinematographyStep';
import CoreFormulaStep from './CoreFormulaStep';
import SequenceStep from './SequenceStep';
import TabNavigation, { defaultTabs } from './TabNavigation';
import VideoSettingsStep from './VideoSettingsStep';

interface VisualFormBuilderV2Props {
  initialData: VeoPromptStructure;
  onChange: (data: VeoPromptStructure) => void;
}

function VisualFormBuilderV2({ initialData, onChange }: VisualFormBuilderV2Props): JSX.Element {
  const [formData, setFormData] = useState<VeoPromptStructure>(initialData);
  const [activeTab, setActiveTab] = useState('settings');

  useEffect(() => {
    if (initialData !== undefined) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleChange = (data: VeoPromptStructure): void => {
    setFormData(data);
    onChange(data);
  };

  // Calculate validation status for each tab
  const validationStatus = useMemo(() => {
    const result = validateVeoPrompt(formData);
    return getTabValidationStatus(formData, result.warnings);
  }, [formData]);

  const currentTabIndex = defaultTabs.findIndex((tab) => tab.id === activeTab);
  const canGoPrevious = currentTabIndex > 0;
  const canGoNext = currentTabIndex < defaultTabs.length - 1;

  const goToPrevious = (): void => {
    if (canGoPrevious) {
      setActiveTab(defaultTabs[currentTabIndex - 1].id);
    }
  };

  const goToNext = (): void => {
    if (canGoNext) {
      setActiveTab(defaultTabs[currentTabIndex + 1].id);
    }
  };

  const renderActiveStep = (): JSX.Element => {
    switch (activeTab) {
      case 'settings':
        return <VideoSettingsStep data={formData} onChange={handleChange} />;
      case 'cinematography':
        return <CinematographyStep data={formData} onChange={handleChange} />;
      case 'core':
        return <CoreFormulaStep data={formData} onChange={handleChange} />;
      case 'sequence':
        return <SequenceStep data={formData} onChange={handleChange} />;
      case 'audio':
        return <AudioStep data={formData} onChange={handleChange} />;
      case 'advanced':
        return <AdvancedStep data={formData} onChange={handleChange} />;
      default:
        return <VideoSettingsStep data={formData} onChange={handleChange} />;
    }
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary-50 to-purple-50 dark:from-primary-900/20 dark:to-purple-900/20 border-2 border-primary-200 dark:border-primary-700 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-primary-900 dark:text-primary-100 mb-2">
          Veo 3.1 Prompt Builder
        </h2>
        <p className="text-sm text-primary-700 dark:text-primary-300">
          Build professional video prompts using the 5-part formula: [Cinematography] + [Subject] +
          [Action] + [Context] + [Style & Ambiance]
        </p>
      </div>

      {/* Tab Navigation */}
      <TabNavigation
        tabs={defaultTabs}
        activeTab={activeTab}
        onTabChange={setActiveTab}
        validationStatus={validationStatus}
      />

      {/* Active Step Content */}
      <div className="animate-fade-in">{renderActiveStep()}</div>

      {/* Navigation Controls */}
      <div className="flex justify-between items-center glass-card rounded-xl p-4 card-3d">
        <button
          onClick={goToPrevious}
          disabled={!canGoPrevious}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
            ${
              canGoPrevious
                ? 'bg-gradient-to-r from-gray-100 to-gray-200 dark:from-gray-700 dark:to-gray-800 text-gray-900 dark:text-white hover:shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }
          `}
        >
          <ChevronLeft className="w-5 h-5" />
          Previous
        </button>

        <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">
          Step {currentTabIndex + 1} of {defaultTabs.length}
        </div>

        <button
          onClick={goToNext}
          disabled={!canGoNext}
          className={`
            flex items-center gap-2 px-6 py-3 rounded-lg font-semibold transition-all duration-200
            ${
              canGoNext
                ? 'btn-premium'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-400 dark:text-gray-600 cursor-not-allowed'
            }
          `}
        >
          Next
          <ChevronRight className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}

export default VisualFormBuilderV2;

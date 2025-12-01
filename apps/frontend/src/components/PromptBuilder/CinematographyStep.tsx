import type { VeoPromptStructure } from '../../data/veoTemplates';
import { CAMERA_MOVEMENTS, COMPOSITIONS, LENS_AND_FOCUS } from '../../data/veoTemplates';
import CollapsibleSection from './CollapsibleSection';
import QuickSuggestions from './QuickSuggestions';

interface CinematographyStepProps {
  data: VeoPromptStructure;
  onChange: (data: VeoPromptStructure) => void;
}

function CinematographyStep({ data, onChange }: CinematographyStepProps): JSX.Element {
  const updateCinematography = (
    field: 'camera_movement' | 'composition' | 'lens_and_focus',
    value: string,
  ): void => {
    const currentValue = data.prompt.cinematography?.[field] || '';
    const values = currentValue
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);

    let newValue: string;
    if (values.includes(value)) {
      newValue = values.filter((v) => v !== value).join(', ');
    } else {
      newValue = [...values, value].join(', ');
    }

    onChange({
      ...data,
      prompt: {
        ...data.prompt,
        cinematography: {
          ...data.prompt.cinematography,
          [field]: newValue,
        },
      },
    });
  };

  const updateCinematographyText = (
    field: 'camera_movement' | 'composition' | 'lens_and_focus',
    value: string,
  ): void => {
    onChange({
      ...data,
      prompt: {
        ...data.prompt,
        cinematography: {
          ...data.prompt.cinematography,
          [field]: value,
        },
      },
    });
  };

  const hasAnyCinematography =
    data.prompt.cinematography?.camera_movement ||
    data.prompt.cinematography?.composition ||
    data.prompt.cinematography?.lens_and_focus;

  const completionStatus = hasAnyCinematography ? 'complete' : 'empty';

  return (
    <CollapsibleSection
      title="Cinematography"
      icon="🎥"
      defaultOpen={true}
      completionStatus={completionStatus}
    >
      <div className="space-y-6">
        {/* Camera Movement */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Camera Movement
          </label>
          <QuickSuggestions
            suggestions={CAMERA_MOVEMENTS}
            onSelect={(suggestion) => updateCinematography('camera_movement', suggestion)}
            selectedValues={data.prompt.cinematography?.camera_movement || ''}
          />
          <input
            type="text"
            value={data.prompt.cinematography?.camera_movement || ''}
            onChange={(e) => updateCinematographyText('camera_movement', e.target.value)}
            className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Dolly shot, Tracking shot"
          />
        </div>

        {/* Composition */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Composition
          </label>
          <QuickSuggestions
            suggestions={COMPOSITIONS}
            onSelect={(suggestion) => updateCinematography('composition', suggestion)}
            selectedValues={data.prompt.cinematography?.composition || ''}
          />
          <input
            type="text"
            value={data.prompt.cinematography?.composition || ''}
            onChange={(e) => updateCinematographyText('composition', e.target.value)}
            className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Wide shot, Close-up"
          />
        </div>

        {/* Lens & Focus */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Lens & Focus
          </label>
          <QuickSuggestions
            suggestions={LENS_AND_FOCUS}
            onSelect={(suggestion) => updateCinematography('lens_and_focus', suggestion)}
            selectedValues={data.prompt.cinematography?.lens_and_focus || ''}
          />
          <input
            type="text"
            value={data.prompt.cinematography?.lens_and_focus || ''}
            onChange={(e) => updateCinematographyText('lens_and_focus', e.target.value)}
            className="mt-2 w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Shallow depth of field"
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Tip:</strong> Click suggestions to add them, or type custom values. Multiple
            values are comma-separated.
          </p>
        </div>
      </div>
    </CollapsibleSection>
  );
}

export default CinematographyStep;

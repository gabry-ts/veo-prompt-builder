import type { VeoPromptStructure } from '../../data/veoTemplates';
import CollapsibleSection from './CollapsibleSection';

interface CoreFormulaStepProps {
  data: VeoPromptStructure;
  onChange: (data: VeoPromptStructure) => void;
}

function CoreFormulaStep({ data, onChange }: CoreFormulaStepProps): JSX.Element {
  const updateField = (
    field: 'subject' | 'action' | 'context' | 'style_and_ambiance',
    value: string,
  ): void => {
    onChange({
      ...data,
      prompt: {
        ...data.prompt,
        [field]: value,
      },
    });
  };

  const filledFields = [
    data.prompt.subject,
    data.prompt.action,
    data.prompt.context,
    data.prompt.style_and_ambiance,
  ].filter((f) => f && f.trim() !== '').length;

  let completionStatus: 'complete' | 'partial' | 'empty';
  if (filledFields === 4) {
    completionStatus = 'complete';
  } else if (filledFields > 0) {
    completionStatus = 'partial';
  } else {
    completionStatus = 'empty';
  }

  return (
    <CollapsibleSection
      title="Core 5-Part Formula"
      icon="📝"
      defaultOpen={true}
      completionStatus={completionStatus}
      required={true}
    >
      <div className="space-y-4">
        <div className="bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-700 rounded-lg p-3 mb-4">
          <p className="text-sm text-primary-800 dark:text-primary-200">
            <strong>Formula:</strong> [Cinematography] + [Subject] + [Action] + [Context] + [Style &
            Ambiance]
          </p>
        </div>

        {/* Subject */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Subject * <span className="text-xs text-gray-500">(Main character or focal point)</span>
          </label>
          <textarea
            value={data.prompt.subject}
            onChange={(e) => updateField('subject', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Young female explorer with leather satchel and messy brown hair in ponytail"
          />
        </div>

        {/* Action */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Action * <span className="text-xs text-gray-500">(What the subject is doing)</span>
          </label>
          <textarea
            value={data.prompt.action}
            onChange={(e) => updateField('action', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Pushes aside jungle vine, discovers hidden ancient ruins"
          />
        </div>

        {/* Context */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Context * <span className="text-xs text-gray-500">(Environment and background)</span>
          </label>
          <textarea
            value={data.prompt.context}
            onChange={(e) => updateField('context', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Dense jungle with moss-covered ancient ruins, dappled sunlight through canopy"
          />
        </div>

        {/* Style & Ambiance */}
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Style & Ambiance *{' '}
            <span className="text-xs text-gray-500">(Aesthetic, mood, lighting)</span>
          </label>
          <textarea
            value={data.prompt.style_and_ambiance}
            onChange={(e) => updateField('style_and_ambiance', e.target.value)}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Cinematic adventure, awe-inspiring, natural lighting with god rays"
          />
        </div>

        <div className="text-sm text-gray-600 dark:text-gray-400">
          Progress: {filledFields}/4 fields completed
        </div>
      </div>
    </CollapsibleSection>
  );
}

export default CoreFormulaStep;

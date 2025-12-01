import type { VeoPromptStructure } from '../../data/veoTemplates';
import CollapsibleSection from './CollapsibleSection';

interface AdvancedStepProps {
  data: VeoPromptStructure;
  onChange: (data: VeoPromptStructure) => void;
}

function AdvancedStep({ data, onChange }: AdvancedStepProps): JSX.Element {
  const updateNegativePrompt = (value: string): void => {
    onChange({
      ...data,
      prompt: {
        ...data.prompt,
        negative_prompt: value,
      },
    });
  };

  const updateCreativeMode = (
    value: 'text-to-video' | 'image-to-video' | 'ingredients-to-video' | 'first-last-frame',
  ): void => {
    onChange({
      ...data,
      prompt: {
        ...data.prompt,
        creative_controls: {
          ...data.prompt.creative_controls,
          mode: value,
        },
      },
    });
  };

  const updateNotes = (value: string): void => {
    onChange({
      ...data,
      prompt: {
        ...data.prompt,
        notes: value,
      },
    });
  };

  return (
    <div className="space-y-4">
      <CollapsibleSection
        title="Negative Prompt"
        icon="🚫"
        defaultOpen={false}
        completionStatus={data.prompt.negative_prompt ? 'complete' : 'empty'}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Negative Prompt <span className="text-xs text-gray-500">(Things to avoid)</span>
          </label>
          <textarea
            value={data.prompt.negative_prompt || ''}
            onChange={(e) => updateNegativePrompt(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., No modern elements, no safety equipment visible, no unnatural lighting"
          />
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
            💡 Use descriptive language instead of multiple "no X" phrases
          </p>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Creative Controls & Mode"
        icon="🎨"
        defaultOpen={false}
        completionStatus={data.prompt.creative_controls?.mode ? 'complete' : 'empty'}
      >
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Generation Mode
            </label>
            <select
              value={data.prompt.creative_controls?.mode || 'text-to-video'}
              onChange={(e) =>
                updateCreativeMode(
                  e.target.value as
                    | 'text-to-video'
                    | 'image-to-video'
                    | 'ingredients-to-video'
                    | 'first-last-frame',
                )
              }
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="text-to-video">Text-to-Video</option>
              <option value="image-to-video">Image-to-Video</option>
              <option value="ingredients-to-video">Ingredients-to-Video</option>
              <option value="first-last-frame">First & Last Frame</option>
            </select>
          </div>

          <div className="bg-purple-50 dark:bg-purple-900/20 border border-purple-200 dark:border-purple-700 rounded-lg p-3">
            <p className="text-sm text-purple-800 dark:text-purple-200">
              <strong>Mode Info:</strong>
              {data.prompt.creative_controls?.mode === 'text-to-video' &&
                ' Standard text-based prompt generation'}
              {data.prompt.creative_controls?.mode === 'image-to-video' &&
                ' Start from a reference image'}
              {data.prompt.creative_controls?.mode === 'ingredients-to-video' &&
                ' Combine multiple reference images (characters, settings)'}
              {data.prompt.creative_controls?.mode === 'first-last-frame' &&
                ' Define start and end frames, Veo generates smooth transition'}
            </p>
          </div>
        </div>
      </CollapsibleSection>

      <CollapsibleSection
        title="Technical Notes"
        icon="📋"
        defaultOpen={false}
        completionStatus={data.prompt.notes ? 'complete' : 'empty'}
      >
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            General Notes <span className="text-xs text-gray-500">(Optional)</span>
          </label>
          <textarea
            value={data.prompt.notes || ''}
            onChange={(e) => updateNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="Technical notes, production details, workflow references..."
          />
        </div>
      </CollapsibleSection>
    </div>
  );
}

export default AdvancedStep;

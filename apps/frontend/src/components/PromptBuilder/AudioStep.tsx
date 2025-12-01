import type { VeoPromptStructure } from '../../data/veoTemplates';
import {
  addDialogueToData,
  updateDialogueInData,
  deleteDialogueFromData,
  addSFXToData,
  updateSFXInData,
  deleteSFXFromData,
  updateAmbientInData,
  getAudioCompletionStatus,
} from './audioHelpers';
import { DialogueItem, SoundEffectItem } from './AudioStepComponents';
import CollapsibleSection from './CollapsibleSection';

interface AudioStepProps {
  data: VeoPromptStructure;
  onChange: (data: VeoPromptStructure) => void;
}

function AudioStep({ data, onChange }: AudioStepProps): JSX.Element {
  return (
    <CollapsibleSection
      title="Audio (Veo 3.1)"
      icon="🔊"
      defaultOpen={false}
      completionStatus={getAudioCompletionStatus(data)}
    >
      <div className="space-y-6">
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Dialogue</h4>
            <button
              onClick={() => onChange(addDialogueToData(data))}
              className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              + Add Dialogue
            </button>
          </div>
          {data.prompt.audio?.dialogue && data.prompt.audio.dialogue.length > 0 ? (
            <div className="space-y-3">
              {data.prompt.audio.dialogue.map((d, i) => (
                <DialogueItem
                  key={i}
                  dialogue={d}
                  index={i}
                  onUpdate={(idx, fld, val) => onChange(updateDialogueInData(data, idx, fld, val))}
                  onDelete={(idx) => onChange(deleteDialogueFromData(data, idx))}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No dialogue added yet</p>
          )}
        </div>

        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold text-gray-900 dark:text-white">Sound Effects (SFX)</h4>
            <button
              onClick={() => onChange(addSFXToData(data))}
              className="px-3 py-1 text-sm bg-primary-600 text-white rounded hover:bg-primary-700 transition-colors"
            >
              + Add SFX
            </button>
          </div>
          {data.prompt.audio?.sound_effects && data.prompt.audio.sound_effects.length > 0 ? (
            <div className="space-y-2">
              {data.prompt.audio.sound_effects.map((sfx, i) => (
                <SoundEffectItem
                  key={i}
                  sfx={sfx}
                  index={i}
                  onUpdate={(idx, val) => onChange(updateSFXInData(data, idx, val))}
                  onDelete={(idx) => onChange(deleteSFXFromData(data, idx))}
                />
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No sound effects added yet</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Ambient Noise
          </label>
          <textarea
            value={data.prompt.audio?.ambient_noise || ''}
            onChange={(e) => onChange(updateAmbientInData(data, e.target.value))}
            rows={2}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="e.g., Quiet office ambience, distant city sounds, ceiling fan humming"
          />
        </div>

        <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-700 rounded-lg p-3">
          <p className="text-sm text-blue-800 dark:text-blue-200">
            💡 <strong>Tip:</strong> Veo 3.1 auto-formats dialogue as: Character says "speech"
            voice_description
          </p>
        </div>
      </div>
    </CollapsibleSection>
  );
}

export default AudioStep;

// Helper components for VisualFormBuilder to reduce file size and complexity

interface DialogueFormItemProps {
  dialogue: { character: string; speech: string; voice_description?: string };
  index: number;
  onUpdate: (
    index: number,
    field: 'character' | 'speech' | 'voice_description',
    value: string,
  ) => void;
  onRemove: (index: number) => void;
}

export function DialogueFormItem({
  dialogue,
  index,
  onUpdate,
  onRemove,
}: DialogueFormItemProps): JSX.Element {
  return (
    <div className="border border-gray-300 dark:border-gray-600 rounded-lg p-3 space-y-2">
      <div className="flex justify-between">
        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
          Line {index + 1}
        </span>
        <button onClick={() => onRemove(index)} className="text-red-600 hover:text-red-700 text-sm">
          Remove
        </button>
      </div>
      <input
        type="text"
        value={dialogue.character}
        onChange={(e) => onUpdate(index, 'character', e.target.value)}
        placeholder="Character name"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <textarea
        value={dialogue.speech}
        onChange={(e) => onUpdate(index, 'speech', e.target.value)}
        placeholder="What the character says (without quotation marks)"
        rows={2}
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <input
        type="text"
        value={dialogue.voice_description || ''}
        onChange={(e) => onUpdate(index, 'voice_description', e.target.value)}
        placeholder="Voice description (e.g., 'in a weary voice', 'cheerfully')"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <p className="text-xs text-gray-500">
        Will be formatted as:{' '}
        <code className="bg-gray-100 dark:bg-gray-700 px-1 rounded">
          {dialogue.character} says &quot;{dialogue.speech}&quot;
          {dialogue.voice_description && ` ${dialogue.voice_description}`}
        </code>
      </p>
    </div>
  );
}

interface SoundEffectFormItemProps {
  sfx: string;
  index: number;
  onUpdate: (index: number, value: string) => void;
  onRemove: (index: number) => void;
}

export function SoundEffectFormItem({
  sfx,
  index,
  onUpdate,
  onRemove,
}: SoundEffectFormItemProps): JSX.Element {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={sfx}
        onChange={(e) => onUpdate(index, e.target.value)}
        placeholder="e.g., Thunder cracks in distance, Door creaking open"
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
      />
      <button onClick={() => onRemove(index)} className="px-3 py-2 text-red-600 hover:text-red-700">
        ×
      </button>
    </div>
  );
}

interface SequenceSegmentFormItemProps {
  segment: {
    timestamp: string;
    shot_description: string;
    emotion?: string;
    sfx?: string;
  };
  index: number;
  canRemove: boolean;
  onUpdate: (
    index: number,
    field: 'timestamp' | 'shot_description' | 'emotion' | 'sfx',
    value: string,
  ) => void;
  onRemove: (index: number) => void;
}

export function SequenceSegmentFormItem({
  segment,
  index,
  canRemove,
  onUpdate,
  onRemove,
}: SequenceSegmentFormItemProps): JSX.Element {
  return (
    <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h4 className="font-semibold text-gray-900 dark:text-white">Shot {index + 1}</h4>
        {canRemove && (
          <button
            onClick={() => onRemove(index)}
            className="text-red-600 hover:text-red-700 text-sm font-medium"
          >
            Remove Shot
          </button>
        )}
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Timestamp
        </label>
        <input
          type="text"
          value={segment.timestamp}
          onChange={(e) => onUpdate(index, 'timestamp', e.target.value)}
          placeholder="[00:00-00:02] or 0.0s-2.0s"
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <p className="text-xs text-gray-500 mt-1">Format: [00:00-00:02] or 0.0s-2.0s</p>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
          Shot Description
        </label>
        <textarea
          value={segment.shot_description}
          onChange={(e) => onUpdate(index, 'shot_description', e.target.value)}
          placeholder="Complete shot description: camera angle, subject, action, lighting, etc."
          rows={4}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
        />
        <p className="text-xs text-gray-500 mt-1">
          Be very specific: include cinematography, subject actions, lighting, mood
        </p>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Emotion <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={segment.emotion || ''}
            onChange={(e) => onUpdate(index, 'emotion', e.target.value)}
            placeholder="e.g., Wonder and awe"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            SFX for this shot <span className="text-gray-400 text-xs">(optional)</span>
          </label>
          <input
            type="text"
            value={segment.sfx || ''}
            onChange={(e) => onUpdate(index, 'sfx', e.target.value)}
            placeholder="e.g., Wind howling, Door slam"
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
          />
        </div>
      </div>
    </div>
  );
}

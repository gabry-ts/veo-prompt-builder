interface DialogueItemProps {
  dialogue: { character: string; speech: string; voice_description?: string };
  index: number;
  onUpdate: (index: number, field: string, value: string) => void;
  onDelete: (index: number) => void;
}

export function DialogueItem({
  dialogue,
  index,
  onUpdate,
  onDelete,
}: DialogueItemProps): JSX.Element {
  return (
    <div className="bg-gray-50 dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-lg p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="font-semibold text-gray-900 dark:text-white">Line {index + 1}</span>
        <button
          onClick={() => onDelete(index)}
          className="text-red-600 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300"
        >
          Remove
        </button>
      </div>
      <div className="space-y-2">
        <input
          type="text"
          value={dialogue.character}
          onChange={(e) => onUpdate(index, 'character', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          placeholder="Character name"
        />
        <textarea
          value={dialogue.speech}
          onChange={(e) => onUpdate(index, 'speech', e.target.value)}
          rows={2}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          placeholder="Speech (no quotation marks)"
        />
        <input
          type="text"
          value={dialogue.voice_description || ''}
          onChange={(e) => onUpdate(index, 'voice_description', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          placeholder="Voice description (optional, e.g., 'in a weary voice')"
        />
      </div>
    </div>
  );
}

interface SoundEffectItemProps {
  sfx: string;
  index: number;
  onUpdate: (index: number, value: string) => void;
  onDelete: (index: number) => void;
}

export function SoundEffectItem({
  sfx,
  index,
  onUpdate,
  onDelete,
}: SoundEffectItemProps): JSX.Element {
  return (
    <div className="flex gap-2">
      <input
        type="text"
        value={sfx}
        onChange={(e) => onUpdate(index, e.target.value)}
        className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
        placeholder="e.g., Door creaking, footsteps"
      />
      <button
        onClick={() => onDelete(index)}
        className="px-3 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
      >
        ×
      </button>
    </div>
  );
}

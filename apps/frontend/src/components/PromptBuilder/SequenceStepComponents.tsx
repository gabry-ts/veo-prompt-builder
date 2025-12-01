interface ShotEditorProps {
  currentShot: {
    timestamp: string;
    shot_description: string;
    emotion?: string;
    sfx?: string;
  };
  selectedShot: number;
  totalShots: number;
  onUpdate: (index: number, field: string, value: string) => void;
  onNavigate: (direction: 'prev' | 'next') => void;
}

export function ShotEditor({
  currentShot,
  selectedShot,
  totalShots,
  onUpdate,
  onNavigate,
}: ShotEditorProps): JSX.Element {
  return (
    <div className="bg-primary-50 dark:bg-primary-900/20 border-2 border-primary-300 dark:border-primary-700 rounded-lg p-4">
      <h4 className="font-bold text-primary-900 dark:text-primary-100 mb-3 flex items-center gap-2">
        <span className="w-8 h-8 bg-primary-600 text-white rounded-full flex items-center justify-center text-sm">
          {selectedShot + 1}
        </span>
        Editing Shot {selectedShot + 1} of {totalShots}
      </h4>

      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Timestamp *{' '}
            <span className="text-xs text-gray-500">(Format: [00:00-00:02] or 0.0s-2.0s)</span>
          </label>
          <input
            type="text"
            value={currentShot.timestamp}
            onChange={(e) => onUpdate(selectedShot, 'timestamp', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="[00:00-00:02]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Shot Description *{' '}
            <span className="text-xs text-gray-500">(Include cinematography, subject, action)</span>
          </label>
          <textarea
            value={currentShot.shot_description}
            onChange={(e) => onUpdate(selectedShot, 'shot_description', e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="Medium shot from behind explorer as she pushes aside jungle vine..."
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Emotion <span className="text-xs text-gray-500">(Optional)</span>
          </label>
          <input
            type="text"
            value={currentShot.emotion || ''}
            onChange={(e) => onUpdate(selectedShot, 'emotion', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="Wonder and reverence"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Sound Effects (SFX) <span className="text-xs text-gray-500">(Optional)</span>
          </label>
          <input
            type="text"
            value={currentShot.sfx || ''}
            onChange={(e) => onUpdate(selectedShot, 'sfx', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            placeholder="Rustling leaves, bird calls"
          />
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => onNavigate('prev')}
            disabled={selectedShot === 0}
            className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            ← Previous
          </button>
          <button
            onClick={() => onNavigate('next')}
            disabled={selectedShot === totalShots - 1}
            className="flex-1 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  );
}

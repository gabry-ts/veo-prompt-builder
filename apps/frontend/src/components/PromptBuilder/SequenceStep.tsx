import { useState } from 'react';
import type { VeoPromptStructure } from '../../data/veoTemplates';
import CollapsibleSection from './CollapsibleSection';
import {
  parseTimestamp,
  getCompletionStatus,
  updateShotInData,
  deleteShotFromData,
  reorderShotInData,
} from './sequenceHelpers';
import { ShotEditor } from './SequenceStepComponents';
import VisualTimeline from './VisualTimeline';

interface SequenceStepProps {
  data: VeoPromptStructure;
  onChange: (data: VeoPromptStructure) => void;
}

function SequenceStep({ data, onChange }: SequenceStepProps): JSX.Element {
  const [selectedShot, setSelectedShot] = useState<number>(0);
  const [viewMode, setViewMode] = useState<'timeline' | 'form'>('timeline');

  const deleteShot = (index: number): void => {
    if (data.prompt.sequence.length <= 1) {
      alert('You must have at least one shot');
      return;
    }
    onChange(deleteShotFromData(data, index));
    if (selectedShot >= data.prompt.sequence.length - 1) {
      setSelectedShot(Math.max(0, data.prompt.sequence.length - 2));
    }
  };

  const currentShot = data.prompt.sequence[selectedShot];

  return (
    <CollapsibleSection
      title="Sequence & Timeline"
      icon="🎞️"
      defaultOpen={true}
      completionStatus={getCompletionStatus(data.prompt.sequence)}
      required={true}
    >
      <div className="space-y-4">
        {/* View mode toggle */}
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('timeline')}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === 'timeline'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            🎬 Timeline View
          </button>
          <button
            onClick={() => setViewMode('form')}
            className={`px-4 py-2 rounded-lg transition-all ${
              viewMode === 'form'
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            📝 Form View
          </button>
          <button
            onClick={() => {
              const lastShot = data.prompt.sequence[data.prompt.sequence.length - 1];
              const lastEnd = lastShot !== undefined ? parseTimestamp(lastShot.timestamp) : 0;
              const newEnd = Math.min(lastEnd + 2, data.video_length);
              const ts = `[00:${String(lastEnd).padStart(2, '0')}-00:${String(newEnd).padStart(2, '0')}]`;
              onChange({
                ...data,
                prompt: {
                  ...data.prompt,
                  sequence: [
                    ...data.prompt.sequence,
                    { timestamp: ts, shot_description: '', emotion: '', sfx: '' },
                  ],
                },
              });
              setSelectedShot(data.prompt.sequence.length);
            }}
            className="ml-auto px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            + Add Shot
          </button>
        </div>

        {/* Timeline View */}
        {viewMode === 'timeline' && (
          <VisualTimeline
            shots={data.prompt.sequence}
            videoLength={data.video_length}
            onShotClick={setSelectedShot}
            onShotDelete={deleteShot}
            onShotReorder={(from, to) => {
              onChange(reorderShotInData(data, from, to));
              setSelectedShot(to);
            }}
            selectedShot={selectedShot}
          />
        )}

        {currentShot !== undefined && (
          <ShotEditor
            currentShot={currentShot}
            selectedShot={selectedShot}
            totalShots={data.prompt.sequence.length}
            onUpdate={(idx, fld, val) => onChange(updateShotInData(data, idx, fld, val))}
            onNavigate={(direction) => {
              if (direction === 'prev') {
                setSelectedShot(Math.max(0, selectedShot - 1));
              } else {
                setSelectedShot(Math.min(data.prompt.sequence.length - 1, selectedShot + 1));
              }
            }}
          />
        )}

        <div className="text-sm text-gray-600 dark:text-gray-400">
          {data.prompt.sequence.length} shot{data.prompt.sequence.length !== 1 ? 's' : ''} • Total
          duration: {data.video_length}s
        </div>
      </div>
    </CollapsibleSection>
  );
}

export default SequenceStep;

import { useState } from 'react';

interface TimelineShot {
  timestamp: string;
  shot_description: string;
  emotion?: string;
  sfx?: string;
}

interface VisualTimelineProps {
  shots: TimelineShot[];
  videoLength: number;
  onShotClick: (index: number) => void;
  onShotDelete: (index: number) => void;
  onShotReorder: (fromIndex: number, toIndex: number) => void;
  selectedShot?: number;
}

function getShotCardClassName(
  index: number,
  selectedShot: number | undefined,
  draggedIndex: number | null,
): string {
  const baseClasses = 'p-4 rounded-lg border-2 cursor-move transition-all';

  if (index === selectedShot) {
    return `${baseClasses} border-primary-500 bg-primary-50 dark:bg-primary-900/20 shadow-lg`;
  }

  if (draggedIndex === index) {
    return `${baseClasses} border-gray-400 bg-gray-100 dark:bg-gray-800 opacity-50`;
  }

  return `${baseClasses} border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-600`;
}

interface TimelineRulerProps {
  videoLength: number;
  shots: TimelineShot[];
  selectedShot: number | undefined;
  onShotClick: (index: number) => void;
}

function TimelineRuler({
  videoLength,
  shots,
  selectedShot,
  onShotClick,
}: TimelineRulerProps): JSX.Element {
  const parseTimestamp = (timestamp: string): { start: number; end: number } | null => {
    const bracketMatch = timestamp.match(/^\[?(\d+):(\d+)-(\d+):(\d+)\]?$/);
    const secondsMatch = timestamp.match(/^(\d+(?:\.\d+)?)s-(\d+(?:\.\d+)?)s$/);

    if (bracketMatch) {
      const startMin = parseInt(bracketMatch[1]);
      const startSec = parseInt(bracketMatch[2]);
      const endMin = parseInt(bracketMatch[3]);
      const endSec = parseInt(bracketMatch[4]);
      return {
        start: startMin * 60 + startSec,
        end: endMin * 60 + endSec,
      };
    } else if (secondsMatch) {
      return {
        start: parseFloat(secondsMatch[1]),
        end: parseFloat(secondsMatch[2]),
      };
    }
    return null;
  };

  return (
    <div className="relative h-12 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-hidden">
      <div className="absolute inset-0 flex">
        {Array.from({ length: videoLength + 1 }).map((_, i) => (
          <div key={i} className="flex-1 border-l border-gray-300 dark:border-gray-700 relative">
            <span className="absolute top-1 left-1 text-xs text-gray-500 dark:text-gray-400">
              {i}s
            </span>
          </div>
        ))}
      </div>
      {shots.map((shot, index) => {
        const parsed = parseTimestamp(shot.timestamp);
        if (!parsed) return null;

        const left = (parsed.start / videoLength) * 100;
        const width = ((parsed.end - parsed.start) / videoLength) * 100;

        return (
          <div
            key={index}
            className={`absolute top-0 bottom-0 rounded cursor-pointer transition-all ${
              index === selectedShot
                ? 'bg-primary-500 ring-2 ring-primary-300 dark:ring-primary-700 z-10'
                : 'bg-primary-400 hover:bg-primary-500'
            }`}
            style={{ left: `${left}%`, width: `${width}%` }}
            onClick={() => onShotClick(index)}
          >
            <div className="h-full flex items-center justify-center">
              <span className="text-white text-xs font-semibold">Shot {index + 1}</span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

interface ShotCardProps {
  shot: TimelineShot;
  index: number;
  selectedShot: number | undefined;
  draggedIndex: number | null;
  onShotClick: (index: number) => void;
  onShotDelete: (index: number) => void;
  onDragStart: (e: React.DragEvent, index: number) => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent, index: number) => void;
}

function ShotCard({
  shot,
  index,
  selectedShot,
  draggedIndex,
  onShotClick,
  onShotDelete,
  onDragStart,
  onDragOver,
  onDrop,
}: ShotCardProps): JSX.Element {
  const parseTimestamp = (timestamp: string): { start: number; end: number } | null => {
    const bracketMatch = timestamp.match(/^\[?(\d+):(\d+)-(\d+):(\d+)\]?$/);
    const secondsMatch = timestamp.match(/^(\d+(?:\.\d+)?)s-(\d+(?:\.\d+)?)s$/);

    if (bracketMatch) {
      const startMin = parseInt(bracketMatch[1]);
      const startSec = parseInt(bracketMatch[2]);
      const endMin = parseInt(bracketMatch[3]);
      const endSec = parseInt(bracketMatch[4]);
      return {
        start: startMin * 60 + startSec,
        end: endMin * 60 + endSec,
      };
    } else if (secondsMatch) {
      return {
        start: parseFloat(secondsMatch[1]),
        end: parseFloat(secondsMatch[2]),
      };
    }
    return null;
  };

  const parsed = parseTimestamp(shot.timestamp);
  const duration = parsed ? (parsed.end - parsed.start).toFixed(1) : '?';

  return (
    <div
      draggable
      onDragStart={(e) => onDragStart(e, index)}
      onDragOver={onDragOver}
      onDrop={(e) => onDrop(e, index)}
      className={getShotCardClassName(index, selectedShot, draggedIndex)}
      onClick={() => onShotClick(index)}
    >
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0">
          <div className="w-10 h-10 bg-primary-600 text-white rounded-full flex items-center justify-center font-bold">
            {index + 1}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-sm font-semibold text-gray-900 dark:text-white">
              {shot.timestamp}
            </span>
            <span className="text-xs text-gray-500 dark:text-gray-400">({duration}s)</span>
            {shot.emotion && (
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-0.5 rounded">
                {shot.emotion}
              </span>
            )}
          </div>
          <p className="text-sm text-gray-700 dark:text-gray-300 line-clamp-2">
            {shot.shot_description || 'No description'}
          </p>
          {shot.sfx && (
            <p className="text-xs text-blue-600 dark:text-blue-400 mt-1">🔊 {shot.sfx}</p>
          )}
        </div>
        <button
          onClick={(e) => {
            e.stopPropagation();
            onShotDelete(index);
          }}
          className="flex-shrink-0 w-8 h-8 bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors flex items-center justify-center"
        >
          ×
        </button>
      </div>
    </div>
  );
}

function VisualTimeline({
  shots,
  videoLength,
  onShotClick,
  onShotDelete,
  onShotReorder,
  selectedShot,
}: VisualTimelineProps): JSX.Element {
  const [draggedIndex, setDraggedIndex] = useState<number | null>(null);

  const handleDragStart = (e: React.DragEvent, index: number): void => {
    setDraggedIndex(index);
    e.dataTransfer.effectAllowed = 'move';
  };

  const handleDragOver = (e: React.DragEvent): void => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, dropIndex: number): void => {
    e.preventDefault();
    if (draggedIndex !== null && draggedIndex !== dropIndex) {
      onShotReorder(draggedIndex, dropIndex);
    }
    setDraggedIndex(null);
  };

  return (
    <div className="space-y-4">
      <TimelineRuler
        videoLength={videoLength}
        shots={shots}
        selectedShot={selectedShot}
        onShotClick={onShotClick}
      />

      <div className="space-y-2">
        {shots.map((shot, index) => (
          <ShotCard
            key={index}
            shot={shot}
            index={index}
            selectedShot={selectedShot}
            draggedIndex={draggedIndex}
            onShotClick={onShotClick}
            onShotDelete={onShotDelete}
            onDragStart={handleDragStart}
            onDragOver={handleDragOver}
            onDrop={handleDrop}
          />
        ))}
      </div>

      {shots.length === 0 && (
        <div className="text-center py-8 text-gray-500 dark:text-gray-400">
          <p>No shots yet. Add your first shot to start building your sequence!</p>
        </div>
      )}
    </div>
  );
}

export default VisualTimeline;

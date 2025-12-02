import { Clapperboard } from 'lucide-react';
import type { VeoPromptStructure } from '../../data/veoTemplates';
import CollapsibleSection from './CollapsibleSection';

interface VideoSettingsStepProps {
  data: VeoPromptStructure;
  onChange: (data: VeoPromptStructure) => void;
}

function VideoSettingsStep({ data, onChange }: VideoSettingsStepProps): JSX.Element {
  const updateSetting = (field: string, value: number | string): void => {
    onChange({
      ...data,
      [field]: value,
    });
  };

  const completionStatus =
    data.video_length && data.resolution && data.aspect_ratio ? 'complete' : 'partial';

  return (
    <CollapsibleSection
      title="Video Settings"
      icon={<Clapperboard className="w-5 h-5" />}
      defaultOpen={true}
      completionStatus={completionStatus}
      required={true}
    >
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Video Length *
          </label>
          <select
            value={data.video_length}
            onChange={(e) => updateSetting('video_length', parseInt(e.target.value))}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          >
            <option value={4}>4 seconds</option>
            <option value={6}>6 seconds</option>
            <option value={8}>8 seconds</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Resolution *
          </label>
          <select
            value={data.resolution}
            onChange={(e) => updateSetting('resolution', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="720p">720p</option>
            <option value="1080p">1080p</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Aspect Ratio *
          </label>
          <select
            value={data.aspect_ratio}
            onChange={(e) => updateSetting('aspect_ratio', e.target.value as '16:9' | '9:16')}
            className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="16:9">16:9 (Landscape)</option>
            <option value="9:16">9:16 (Portrait)</option>
          </select>
        </div>
      </div>
    </CollapsibleSection>
  );
}

export default VideoSettingsStep;

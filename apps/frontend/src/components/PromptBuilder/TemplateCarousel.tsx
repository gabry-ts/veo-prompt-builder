import { useState } from 'react';
import { veoTemplates, type TemplateDomain } from '../../data/veoTemplates';

interface TemplateCarouselProps {
  onSelectTemplate: (template: TemplateDomain) => void;
}

function TemplateCarousel({ onSelectTemplate }: TemplateCarouselProps): JSX.Element {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');

  const categories = [
    { id: 'all', name: 'All Templates', icon: '🎬' },
    { id: 'cinematic', name: 'Cinematic', icon: '🎥' },
    { id: 'dialogue', name: 'Dialogue', icon: '💬' },
    { id: 'commercial', name: 'Commercial', icon: '📺' },
    { id: 'abstract', name: 'Abstract', icon: '🎨' },
    { id: 'nature', name: 'Nature', icon: '🌿' },
    { id: 'tech', name: 'Tech', icon: '🤖' },
  ];

  const filteredTemplates =
    selectedCategory === 'all'
      ? veoTemplates
      : veoTemplates.filter((t) => t.category === selectedCategory);

  return (
    <div className="space-y-6">
      {/* Category tabs */}
      <div className="flex gap-2 overflow-x-auto pb-2">
        {categories.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setSelectedCategory(cat.id)}
            className={`px-4 py-2 rounded-lg whitespace-nowrap transition-all ${
              selectedCategory === cat.id
                ? 'bg-primary-600 text-white shadow-lg'
                : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
            }`}
          >
            {cat.icon} {cat.name}
          </button>
        ))}
      </div>

      {/* Templates grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredTemplates.map((template) => (
          <button
            key={template.id}
            onClick={() => onSelectTemplate(template)}
            className="text-left p-6 bg-white dark:bg-gray-800 rounded-xl border-2 border-gray-200 dark:border-gray-700 hover:border-primary-500 dark:hover:border-primary-500 hover:shadow-xl transition-all group"
          >
            <div className="flex items-start gap-4">
              <div className="text-5xl group-hover:scale-110 transition-transform">
                {template.icon}
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-2 group-hover:text-primary-600 dark:group-hover:text-primary-400">
                  {template.name}
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                  {template.description}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-1 rounded">
                    {template.template.video_length}s
                  </span>
                  <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
                    {template.template.aspect_ratio}
                  </span>
                  <span className="text-xs bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded">
                    {template.template.prompt.sequence.length} shots
                  </span>
                </div>
              </div>
            </div>
          </button>
        ))}
      </div>

      {filteredTemplates.length === 0 && (
        <div className="text-center py-12 text-gray-500 dark:text-gray-400">
          <p className="text-lg">No templates found in this category</p>
          <p className="text-sm">Try selecting a different category</p>
        </div>
      )}
    </div>
  );
}

export default TemplateCarousel;

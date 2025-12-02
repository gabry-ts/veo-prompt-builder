import { useState, useRef, useEffect } from 'react';
import { Tags, X, Plus } from 'lucide-react';

interface TagMultiselectProps {
  tags: string[];
  onTagsChange: (tags: string[]) => void;
}

function TagMultiselect({ tags, onTagsChange }: TagMultiselectProps): JSX.Element {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleAddTag = (): void => {
    const trimmed = inputValue.trim();
    if (trimmed && !tags.includes(trimmed)) {
      onTagsChange([...tags, trimmed]);
      setInputValue('');
    }
  };

  const handleRemoveTag = (tagToRemove: string): void => {
    onTagsChange(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddTag();
    }
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        onClick={() => {
          setIsOpen(!isOpen);
          if (!isOpen) {
            setTimeout(() => inputRef.current?.focus(), 100);
          }
        }}
        className="flex items-center gap-2 px-4 py-2.5 rounded-lg border-2 transition-all font-semibold shadow-md bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        <Tags className="w-4 h-4" />
        <span className="hidden sm:inline">Tags</span>
        {tags.length > 0 && (
          <span className="px-2 py-0.5 bg-primary-100 dark:bg-primary-900 text-primary-700 dark:text-primary-300 rounded-full text-xs font-bold">
            {tags.length}
          </span>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg border-2 border-gray-200 dark:border-gray-700 shadow-xl z-50">
          <div className="p-4">
            <div className="flex items-center gap-2 mb-3">
              <Tags className="w-4 h-4 text-gray-600 dark:text-gray-400" />
              <h3 className="text-sm font-bold text-gray-900 dark:text-white">Manage Tags</h3>
            </div>

            {/* Input for adding new tags */}
            <div className="flex gap-2 mb-3">
              <input
                ref={inputRef}
                type="text"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Add a tag..."
                className="flex-1 px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-900 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <button
                onClick={handleAddTag}
                disabled={!inputValue.trim()}
                className="px-3 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>

            {/* Display current tags */}
            <div className="space-y-2 max-h-60 overflow-y-auto">
              {tags.length === 0 ? (
                <p className="text-sm text-gray-500 dark:text-gray-400 text-center py-4">
                  No tags yet. Add one above!
                </p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <span
                      key={tag}
                      className="inline-flex items-center gap-1 px-3 py-1.5 bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 rounded-full text-sm font-medium group hover:bg-emerald-200 dark:hover:bg-emerald-900/50 transition-colors"
                    >
                      {tag}
                      <button
                        onClick={() => handleRemoveTag(tag)}
                        className="ml-1 hover:bg-emerald-200 dark:hover:bg-emerald-800 rounded-full p-0.5 transition-colors"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default TagMultiselect;

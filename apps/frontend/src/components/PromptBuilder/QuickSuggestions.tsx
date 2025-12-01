import { Check, Sparkles } from 'lucide-react';

interface QuickSuggestionsProps {
  suggestions: string[];
  onSelect: (suggestion: string) => void;
  selectedValues?: string;
  label?: string;
}

function QuickSuggestions({
  suggestions,
  onSelect,
  selectedValues = '',
  label,
}: QuickSuggestionsProps): JSX.Element {
  const selected = selectedValues
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);

  return (
    <div className="space-y-3">
      {label && (
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-accent-500" />
          <div className="text-sm font-semibold text-gray-700 dark:text-gray-300">{label}</div>
        </div>
      )}
      <div className="flex flex-wrap gap-2">
        {suggestions.map((suggestion, index) => {
          const isSelected = selected.includes(suggestion);
          return (
            <button
              key={suggestion}
              type="button"
              onClick={() => onSelect(suggestion)}
              className={`
                group relative px-4 py-2 text-sm font-medium rounded-xl
                transition-all duration-300 ease-out
                transform hover:scale-105 hover:-translate-y-0.5
                animate-fade-in
                ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 text-white shadow-lg shadow-primary-500/50 dark:shadow-primary-500/30'
                    : 'glass-card hover:shadow-md text-gray-700 dark:text-gray-300'
                }
              `}
              style={{
                animationDelay: `${index * 50}ms`,
              }}
            >
              {/* Glow effect on hover */}
              <div
                className={`absolute inset-0 rounded-xl blur-md transition-opacity duration-300 ${
                  isSelected
                    ? 'bg-gradient-to-r from-primary-500 to-accent-500 opacity-50'
                    : 'bg-primary-500/20 opacity-0 group-hover:opacity-30'
                }`}
                style={{ zIndex: -1 }}
              />

              <span className="relative z-10 flex items-center gap-1.5">
                {isSelected && <Check className="w-4 h-4 animate-scale-in" />}
                {suggestion}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export default QuickSuggestions;

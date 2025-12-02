import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, Heart, Edit, FileText, Copy, Trash2, Check, Link as LinkIcon } from 'lucide-react';
import MarkdownPreview from '../components/MarkdownPreview';
import StarRating from '../components/StarRating';
import ValidationPanel from '../components/ValidationPanel';
import type { VeoPromptStructure } from '../data/veoTemplates';
import { usePromptFilters } from '../hooks/usePromptFilters';
import { promptService } from '../services/promptService';
import type { Prompt } from '../types/prompt';
import { validateVeoPrompt } from '../utils/veoValidation';

interface PromptFiltersProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  filterTag: string;
  onFilterTagChange: (value: string) => void;
  sortBy: 'date' | 'name';
  onSortByChange: (value: 'date' | 'name') => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
  allTags: string[];
}

function PromptFilters({
  searchQuery,
  onSearchChange,
  filterTag,
  onFilterTagChange,
  sortBy,
  onSortByChange,
  showFavoritesOnly,
  onToggleFavorites,
  allTags,
}: PromptFiltersProps): JSX.Element {
  return (
    <div className="mb-6 flex flex-col gap-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1 relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prompts by name, description or tags..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          />
        </div>
        <div className="flex gap-2">
          <select
            value={filterTag}
            onChange={(e) => onFilterTagChange(e.target.value)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="">All Tags</option>
            {allTags.map((tag) => (
              <option key={tag} value={tag}>
                {tag}
              </option>
            ))}
          </select>
          <select
            value={sortBy}
            onChange={(e) => onSortByChange(e.target.value as 'date' | 'name')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="date">Sort by Date</option>
            <option value="name">Sort by Name</option>
          </select>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onToggleFavorites}
          className={`px-4 py-2 rounded-lg transition-colors flex items-center gap-2 ${
            showFavoritesOnly
              ? 'bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-400 border-2 border-red-500'
              : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-400 border-2 border-transparent'
          }`}
        >
          <Heart className={`w-4 h-4 ${showFavoritesOnly ? 'fill-current' : ''}`} />
          {showFavoritesOnly ? 'Favorites Only' : 'Show All'}
        </button>
      </div>
    </div>
  );
}

interface PromptCardProps {
  prompt: Prompt;
  onDelete: (id: string) => void;
  onDuplicate: (prompt: Prompt) => void;
  onToggleFavorite: (id: string, isFavorite: boolean) => void;
  onRate: (id: string, rating: number) => void;
  isDuplicating: boolean;
  isDeleting: boolean;
}

function PromptCard({
  prompt,
  onDelete,
  onDuplicate,
  onToggleFavorite,
  onRate,
  isDuplicating,
  isDeleting,
}: PromptCardProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const promptData = prompt.jsonData as unknown as VeoPromptStructure;
  const validation = useMemo(() => validateVeoPrompt(promptData), [promptData]);
  const hasErrors = validation.warnings.some((w) => w.severity === 'error');
  const hasWarnings = validation.warnings.some((w) => w.severity === 'warning');

  const handleCopyJSON = (): void => {
    void navigator.clipboard.writeText(JSON.stringify(prompt.jsonData, null, 2)).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-600 transition-all overflow-hidden">
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex-1 line-clamp-2">
            {prompt.name}
          </h3>
          <div className="flex items-center gap-2 ml-2">
            <button
              onClick={() => onToggleFavorite(prompt.id, !prompt.isFavorite)}
              className="transition-transform hover:scale-125"
              title={prompt.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
            >
              <Heart
                className={`w-5 h-5 ${prompt.isFavorite ? 'fill-red-500 text-red-500' : 'text-gray-400'}`}
              />
            </button>
            {hasErrors && <div className="w-3 h-3 bg-red-500 rounded-full" title="Has errors" />}
            {!hasErrors && hasWarnings && (
              <div className="w-3 h-3 bg-yellow-500 rounded-full" title="Has warnings" />
            )}
            {!hasErrors && !hasWarnings && (
              <div className="w-3 h-3 bg-green-500 rounded-full" title="Valid" />
            )}
          </div>
        </div>

        {prompt.description && (
          <div className="mb-3 line-clamp-2">
            <MarkdownPreview
              content={prompt.description}
              className="text-gray-600 dark:text-gray-400 text-sm"
            />
          </div>
        )}

        <div className="mb-3">
          <StarRating rating={prompt.rating} onRate={(rating) => onRate(prompt.id, rating)} />
        </div>

        {prompt.tags.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {prompt.tags.map((tag) => (
              <span
                key={tag}
                className="text-xs bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-400 px-2 py-1 rounded"
              >
                {tag}
              </span>
            ))}
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-3">
          <span className="text-xs bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-2 py-1 rounded">
            {promptData.video_length}s
          </span>
          <span className="text-xs bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 px-2 py-1 rounded">
            {promptData.aspect_ratio}
          </span>
          <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-400 px-2 py-1 rounded">
            {promptData.prompt.sequence?.length || 0} shots
          </span>
        </div>

        <ValidationPanel result={validation} compact={true} />
      </div>

      <div className="bg-gray-50 dark:bg-gray-900 px-6 py-4 border-t border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-500 mb-3">
          <span>Updated {new Date(prompt.updatedAt).toLocaleDateString()}</span>
          {prompt.isPublic && (
            <span className="bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400 px-2 py-1 rounded flex items-center gap-1">
              <LinkIcon className="w-3 h-3" /> Public
            </span>
          )}
        </div>
        <div className="flex flex-col gap-2">
          <Link
            to={`/prompts/${prompt.id}`}
            className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center font-semibold flex items-center justify-center gap-2"
          >
            <Edit className="w-4 h-4" /> Edit
          </Link>
          <div className="flex gap-2">
            <button
              onClick={handleCopyJSON}
              className="flex-1 px-3 py-2 text-sm bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors font-semibold flex items-center justify-center"
              title="Copy JSON"
            >
              {copied ? <Check className="w-4 h-4" /> : <FileText className="w-4 h-4" />}
            </button>
            <button
              onClick={() => onDuplicate(prompt)}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold flex items-center justify-center"
              disabled={isDuplicating}
            >
              <Copy className="w-4 h-4" />
            </button>
            <button
              onClick={() => onDelete(prompt.id)}
              className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold flex items-center justify-center"
              disabled={isDeleting}
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage(): JSX.Element {
  const queryClient = useQueryClient();

  const { data: prompts, isLoading } = useQuery({
    queryKey: ['prompts'],
    queryFn: () => promptService.getAll(),
  });

  const {
    searchQuery,
    setSearchQuery,
    sortBy,
    setSortBy,
    filterTag,
    setFilterTag,
    showFavoritesOnly,
    setShowFavoritesOnly,
    allTags,
    filteredAndSortedPrompts,
  } = usePromptFilters(prompts);

  const deleteMutation = useMutation({
    mutationFn: (id: string) => promptService.delete(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });

  const duplicateMutation = useMutation({
    mutationFn: (prompt: Prompt) =>
      promptService.create({
        name: `${prompt.name} (Copy)`,
        description: prompt.description,
        jsonData: prompt.jsonData,
        tags: prompt.tags,
        isFavorite: prompt.isFavorite,
        rating: prompt.rating,
        isPublic: prompt.isPublic,
      }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: Partial<Prompt> }) =>
      promptService.update(id, data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prompts'] });
    },
  });

  const handleDelete = (id: string): void => {
    if (window.confirm('Are you sure you want to delete this prompt?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleDuplicate = (prompt: Prompt): void => {
    duplicateMutation.mutate(prompt);
  };

  const handleToggleFavorite = (id: string, isFavorite: boolean): void => {
    updateMutation.mutate({ id, data: { isFavorite } });
  };

  const handleRate = (id: string, rating: number): void => {
    updateMutation.mutate({ id, data: { rating } });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">My Prompts</h1>
        <Link
          to="/prompts/new"
          className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          + Create New Prompt
        </Link>
      </div>

      {prompts && prompts.length > 0 && (
        <PromptFilters
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          filterTag={filterTag}
          onFilterTagChange={setFilterTag}
          sortBy={sortBy}
          onSortByChange={setSortBy}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={() => setShowFavoritesOnly(!showFavoritesOnly)}
          allTags={allTags}
        />
      )}

      {isLoading && (
        <div className="text-center text-gray-600 dark:text-gray-400">Loading prompts...</div>
      )}

      {!isLoading && prompts && prompts.length === 0 && (
        <div className="text-center text-gray-600 dark:text-gray-400 py-12">
          <p className="text-xl mb-4">No prompts yet</p>
          <p>Create your first Veo JSON prompt to get started!</p>
        </div>
      )}

      {!isLoading &&
        filteredAndSortedPrompts &&
        filteredAndSortedPrompts.length === 0 &&
        prompts &&
        prompts.length > 0 && (
          <div className="text-center text-gray-600 dark:text-gray-400 py-12">
            <p className="text-xl mb-4">No prompts found</p>
            <p>Try adjusting your search query</p>
          </div>
        )}

      {!isLoading && filteredAndSortedPrompts && filteredAndSortedPrompts.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAndSortedPrompts.map((prompt) => (
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onDelete={handleDelete}
              onDuplicate={handleDuplicate}
              onToggleFavorite={handleToggleFavorite}
              onRate={handleRate}
              isDuplicating={duplicateMutation.isPending}
              isDeleting={deleteMutation.isPending}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default DashboardPage;

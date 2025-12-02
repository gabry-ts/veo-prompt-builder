import { useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { useInView } from 'react-intersection-observer';
import {
  Search,
  Heart,
  Edit,
  FileText,
  Copy,
  Trash2,
  Check,
  Link as LinkIcon,
  Film,
  Star,
  CheckCircle,
} from 'lucide-react';
import MarkdownPreview from '../components/MarkdownPreview';
import StarRating from '../components/StarRating';
import BulkActionBar from '../components/BulkActionBar';
import type { VeoPromptStructure } from '../data/veoTemplates';
import { usePromptFilters } from '../hooks/usePromptFilters';
import { useInfinitePrompts } from '../hooks/useInfinitePrompts';
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
  isSelected: boolean;
  onToggleSelect: (id: string) => void;
  selectionModeActive: boolean;
}

/* eslint-disable max-lines-per-function */
function PromptCard({
  prompt,
  onDelete,
  onDuplicate,
  onToggleFavorite,
  onRate,
  isDuplicating,
  isDeleting,
  isSelected,
  onToggleSelect,
  selectionModeActive,
}: PromptCardProps): JSX.Element {
  const [copied, setCopied] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
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

  // Gradient based on prompt status
  const getGradient = (): string => {
    if (hasErrors) return 'from-red-500/20 via-orange-500/10 to-transparent';
    if (hasWarnings) return 'from-yellow-500/20 via-amber-500/10 to-transparent';
    if (prompt.isFavorite) return 'from-pink-500/20 via-purple-500/10 to-transparent';
    return 'from-blue-500/20 via-cyan-500/10 to-transparent';
  };

  return (
    <div
      className="group relative"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Selection Checkbox - Top Right on Hover or when selection mode active */}
      <div
        className={`absolute top-4 right-4 z-30 transition-all duration-300 ${
          isHovered || isSelected || selectionModeActive
            ? 'opacity-100 translate-y-0'
            : 'opacity-0 -translate-y-2 pointer-events-none'
        }`}
      >
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleSelect(prompt.id);
          }}
          className={`w-10 h-10 rounded-full border-2 transition-all duration-200 flex items-center justify-center shadow-lg backdrop-blur-sm ${
            isSelected
              ? 'bg-primary-600 border-primary-600 scale-110'
              : 'bg-white/90 dark:bg-gray-800/90 border-gray-300 dark:border-gray-600 hover:border-primary-400 dark:hover:border-primary-500 hover:scale-105'
          }`}
        >
          {isSelected && <Check className="w-5 h-5 text-white" strokeWidth={3} />}
        </button>
      </div>

      {/* Glassmorphism Card */}
      <div
        className={`relative bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-2xl border ${isSelected ? 'border-primary-500 border-4' : 'border-white/20 dark:border-gray-700/50'} shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden`}
      >
        {/* Gradient Background */}
        <div
          className={`absolute inset-0 bg-gradient-to-br ${getGradient()} opacity-50 transition-opacity duration-500 ${isHovered ? 'opacity-100' : 'opacity-50'}`}
        />

        {/* Animated Border Glow */}
        <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-gradient-to-r from-primary-500/50 via-purple-500/50 to-pink-500/50 blur-xl -z-10" />

        {/* Content */}
        <div className="relative p-6">
          {/* Header */}
          <div className="flex items-start justify-between mb-4">
            <div className="flex-1 min-w-0">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white line-clamp-2 mb-1 group-hover:text-primary-600 dark:group-hover:text-primary-400 transition-colors">
                {prompt.name}
              </h3>
              {prompt.description && (
                <div className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                  <MarkdownPreview content={prompt.description} />
                </div>
              )}
            </div>

            {/* Status & Favorite */}
            <div className="flex items-center gap-2 ml-3">
              <button
                onClick={() => onToggleFavorite(prompt.id, !prompt.isFavorite)}
                className={`p-2 rounded-full transition-all duration-300 ${
                  prompt.isFavorite
                    ? 'bg-red-500/20 hover:bg-red-500/30'
                    : 'bg-gray-100/50 dark:bg-gray-700/50 hover:bg-gray-200/50 dark:hover:bg-gray-600/50'
                }`}
              >
                <Heart
                  className={`w-5 h-5 transition-all duration-300 ${
                    prompt.isFavorite
                      ? 'fill-red-500 text-red-500 scale-110'
                      : 'text-gray-400 group-hover:scale-110'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Tags */}
          {prompt.tags.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-4">
              {prompt.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1 text-xs font-medium bg-gradient-to-r from-emerald-500/20 to-teal-500/20 text-emerald-700 dark:text-emerald-300 rounded-full backdrop-blur-sm border border-emerald-500/30"
                >
                  {tag}
                </span>
              ))}
              {prompt.tags.length > 3 && (
                <span className="px-3 py-1 text-xs font-medium bg-gray-500/20 text-gray-700 dark:text-gray-300 rounded-full backdrop-blur-sm">
                  +{prompt.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {/* Metadata Pills */}
          <div className="flex flex-wrap items-center gap-2 mb-4">
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-blue-500/10 to-cyan-500/10 rounded-full border border-blue-500/20">
              <Film className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />
              <span className="text-xs font-semibold text-blue-700 dark:text-blue-300">
                {promptData.video_length}s
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-500/10 to-pink-500/10 rounded-full border border-purple-500/20">
              <span className="text-xs font-semibold text-purple-700 dark:text-purple-300">
                {promptData.aspect_ratio}
              </span>
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-indigo-500/10 to-violet-500/10 rounded-full border border-indigo-500/20">
              <span className="text-xs font-semibold text-indigo-700 dark:text-indigo-300">
                {promptData.prompt.sequence?.length || 0} shots
              </span>
            </div>
            {prompt.isPublic && (
              <div className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-full border border-green-500/20">
                <LinkIcon className="w-3 h-3 text-green-600 dark:text-green-400" />
                <span className="text-xs font-semibold text-green-700 dark:text-green-300">
                  Public
                </span>
              </div>
            )}
          </div>

          {/* Rating & Validation */}
          <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-200/50 dark:border-gray-700/50">
            <StarRating rating={prompt.rating} onRate={(rating) => onRate(prompt.id, rating)} />
            <div className="flex items-center gap-2">
              {hasErrors && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-red-500/10 rounded-full">
                  <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-red-700 dark:text-red-400">Errors</span>
                </div>
              )}
              {!hasErrors && hasWarnings && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-yellow-500/10 rounded-full">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full animate-pulse" />
                  <span className="text-xs font-medium text-yellow-700 dark:text-yellow-400">
                    Warnings
                  </span>
                </div>
              )}
              {!hasErrors && !hasWarnings && (
                <div className="flex items-center gap-1.5 px-2 py-1 bg-green-500/10 rounded-full">
                  <CheckCircle className="w-3.5 h-3.5 text-green-600 dark:text-green-400" />
                  <span className="text-xs font-medium text-green-700 dark:text-green-400">
                    Valid
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="space-y-2">
            <Link
              to={`/prompts/${prompt.id}`}
              className="block w-full px-4 py-2.5 bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white rounded-xl font-semibold text-center transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
            >
              <span className="flex items-center justify-center gap-2">
                <Edit className="w-4 h-4" />
                Edit Prompt
              </span>
            </Link>

            <div className="grid grid-cols-3 gap-2">
              <button
                onClick={handleCopyJSON}
                className="px-3 py-2 bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 backdrop-blur-sm rounded-xl transition-all duration-300 text-gray-700 dark:text-gray-300 font-medium"
                title="Copy JSON"
              >
                {copied ? (
                  <Check className="w-4 h-4 mx-auto text-green-600" />
                ) : (
                  <FileText className="w-4 h-4 mx-auto" />
                )}
              </button>
              <button
                onClick={() => onDuplicate(prompt)}
                className="px-3 py-2 bg-white/50 dark:bg-gray-700/50 hover:bg-white/70 dark:hover:bg-gray-700/70 backdrop-blur-sm rounded-xl transition-all duration-300 text-gray-700 dark:text-gray-300 font-medium disabled:opacity-50"
                disabled={isDuplicating}
              >
                <Copy className="w-4 h-4 mx-auto" />
              </button>
              <button
                onClick={() => onDelete(prompt.id)}
                className="px-3 py-2 bg-white/50 dark:bg-gray-700/50 hover:bg-red-500/20 dark:hover:bg-red-500/20 backdrop-blur-sm rounded-xl transition-all duration-300 text-gray-700 dark:text-gray-300 hover:text-red-600 dark:hover:text-red-400 font-medium disabled:opacity-50"
                disabled={isDeleting}
              >
                <Trash2 className="w-4 h-4 mx-auto" />
              </button>
            </div>
          </div>

          {/* Footer */}
          <div className="mt-4 pt-3 border-t border-gray-200/50 dark:border-gray-700/50">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Updated {new Date(prompt.updatedAt).toLocaleDateString()}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

/* eslint-disable max-lines-per-function */
function DashboardPage(): JSX.Element {
  const queryClient = useQueryClient();

  const { data, isLoading, isFetchingNextPage, hasNextPage, fetchNextPage } = useInfinitePrompts();

  const prompts = data?.allPrompts;

  // Infinite scroll observer
  const { ref: loadMoreRef, inView } = useInView({
    threshold: 0,
  });

  // Trigger fetch when loadMoreRef is in view
  if (inView && hasNextPage && !isFetchingNextPage) {
    void fetchNextPage();
  }

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

  const [selectedPromptIds, setSelectedPromptIds] = useState<Set<string>>(new Set());

  const bulkDeleteMutation = useMutation({
    mutationFn: (ids: string[]) => promptService.deleteBulk(ids),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ['prompts'] });
      setSelectedPromptIds(new Set());
    },
  });

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

  const handleToggleSelect = (id: string): void => {
    setSelectedPromptIds((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(id)) {
        newSet.delete(id);
      } else {
        newSet.add(id);
      }
      return newSet;
    });
  };

  const handleBulkDelete = (): void => {
    bulkDeleteMutation.mutate(Array.from(selectedPromptIds));
  };

  const handleCancelSelection = (): void => {
    setSelectedPromptIds(new Set());
  };

  const stats = useMemo(() => {
    if (!prompts) return null;
    const totalPrompts = prompts.length;
    const favoriteCount = prompts.filter((p) => p.isFavorite).length;
    const validCount = prompts.filter((p) => {
      const validation = validateVeoPrompt(p.jsonData as unknown as VeoPromptStructure);
      return !validation.warnings.some((w) => w.severity === 'error');
    }).length;
    const avgRating = prompts.reduce((sum, p) => sum + (p.rating || 0), 0) / (totalPrompts || 1);

    return { totalPrompts, favoriteCount, validCount, avgRating };
  }, [prompts]);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 dark:text-white flex items-center gap-3">
              <Film className="w-10 h-10 text-primary-600" />
              My Prompts
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Manage your Veo 3.1 video prompts
            </p>
          </div>
          <Link
            to="/prompts/new"
            className="px-6 py-3 bg-gradient-to-r from-primary-600 to-primary-700 text-white rounded-lg hover:from-primary-700 hover:to-primary-800 transition-all shadow-lg hover:shadow-xl font-semibold"
          >
            + Create New Prompt
          </Link>
        </div>

        {/* Stats Cards */}
        {stats && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-xl p-6 border-2 border-blue-200 dark:border-blue-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600 dark:text-blue-400">
                    Total Prompts
                  </p>
                  <p className="text-3xl font-bold text-blue-900 dark:text-blue-100 mt-1">
                    {stats.totalPrompts}
                  </p>
                </div>
                <Film className="w-12 h-12 text-blue-500 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-red-50 to-red-100 dark:from-red-900/20 dark:to-red-800/20 rounded-xl p-6 border-2 border-red-200 dark:border-red-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-red-600 dark:text-red-400">Favorites</p>
                  <p className="text-3xl font-bold text-red-900 dark:text-red-100 mt-1">
                    {stats.favoriteCount}
                  </p>
                </div>
                <Heart className="w-12 h-12 text-red-500 opacity-50 fill-current" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-xl p-6 border-2 border-green-200 dark:border-green-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600 dark:text-green-400">
                    Valid Prompts
                  </p>
                  <p className="text-3xl font-bold text-green-900 dark:text-green-100 mt-1">
                    {stats.validCount}
                  </p>
                </div>
                <CheckCircle className="w-12 h-12 text-green-500 opacity-50" />
              </div>
            </div>

            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-xl p-6 border-2 border-yellow-200 dark:border-yellow-700">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-yellow-600 dark:text-yellow-400">
                    Avg Rating
                  </p>
                  <p className="text-3xl font-bold text-yellow-900 dark:text-yellow-100 mt-1">
                    {stats.avgRating.toFixed(1)}
                  </p>
                </div>
                <Star className="w-12 h-12 text-yellow-500 opacity-50 fill-current" />
              </div>
            </div>
          </div>
        )}
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
        <>
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
                isSelected={selectedPromptIds.has(prompt.id)}
                onToggleSelect={handleToggleSelect}
                selectionModeActive={selectedPromptIds.size > 0}
              />
            ))}
          </div>

          {/* Infinite Scroll Trigger */}
          {hasNextPage && (
            <div ref={loadMoreRef} className="py-8 flex justify-center">
              {isFetchingNextPage ? (
                <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400">
                  <div className="w-6 h-6 border-2 border-primary-600 border-t-transparent rounded-full animate-spin" />
                  <span>Loading more prompts...</span>
                </div>
              ) : (
                <div className="text-sm text-gray-500 dark:text-gray-400">Scroll to load more</div>
              )}
            </div>
          )}
        </>
      )}

      {/* Bulk Action Bar */}
      {selectedPromptIds.size > 0 && (
        <BulkActionBar
          selectedCount={selectedPromptIds.size}
          onDelete={handleBulkDelete}
          onCancel={handleCancelSelection}
        />
      )}
    </div>
  );
}

export default DashboardPage;

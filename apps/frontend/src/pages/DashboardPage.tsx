import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import ValidationPanel from '../components/ValidationPanel';
import type { VeoPromptStructure } from '../data/veoTemplates';
import { promptService } from '../services/promptService';
import type { Prompt } from '../types/prompt';
import { validateVeoPrompt } from '../utils/veoValidation';

interface PromptCardProps {
  prompt: Prompt;
  onDelete: (id: string) => void;
  onDuplicate: (prompt: Prompt) => void;
  isDuplicating: boolean;
  isDeleting: boolean;
}

function PromptCard({
  prompt,
  onDelete,
  onDuplicate,
  isDuplicating,
  isDeleting,
}: PromptCardProps): JSX.Element {
  const promptData = prompt.jsonData as unknown as VeoPromptStructure;
  const validation = useMemo(() => validateVeoPrompt(promptData), [promptData]);
  const hasErrors = validation.warnings.some((w) => w.severity === 'error');
  const hasWarnings = validation.warnings.some((w) => w.severity === 'warning');

  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md border-2 border-gray-200 dark:border-gray-700 hover:shadow-xl hover:border-primary-400 dark:hover:border-primary-600 transition-all overflow-hidden">
      <div className="p-6 pb-4">
        <div className="flex items-start justify-between mb-3">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white flex-1 line-clamp-2">
            {prompt.name}
          </h3>
          <div className="ml-2">
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
          <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 line-clamp-2">
            {prompt.description}
          </p>
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
        <div className="text-xs text-gray-500 dark:text-gray-500 mb-3">
          Updated {new Date(prompt.updatedAt).toLocaleDateString()}
        </div>
        <div className="flex flex-col gap-2">
          <Link
            to={`/prompts/${prompt.id}`}
            className="px-3 py-2 text-sm bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors text-center font-semibold"
          >
            ✏️ Edit
          </Link>
          <div className="flex gap-2">
            <button
              onClick={() => onDuplicate(prompt)}
              className="flex-1 px-3 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-semibold"
              disabled={isDuplicating}
            >
              📋
            </button>
            <button
              onClick={() => onDelete(prompt.id)}
              className="flex-1 px-3 py-2 text-sm bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors font-semibold"
              disabled={isDeleting}
            >
              🗑️
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function DashboardPage(): JSX.Element {
  const queryClient = useQueryClient();
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');

  const { data: prompts, isLoading } = useQuery({
    queryKey: ['prompts'],
    queryFn: () => promptService.getAll(),
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
      }),
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

  // Filter and sort prompts
  const filteredAndSortedPrompts = prompts
    ?.filter((prompt) => {
      const searchLower = searchQuery.toLowerCase();
      return (
        prompt.name.toLowerCase().includes(searchLower) ||
        prompt.description?.toLowerCase().includes(searchLower)
      );
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

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

      {/* Search and Filter */}
      {prompts && prompts.length > 0 && (
        <div className="mb-6 flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="🔍 Search prompts by name or description..."
              className="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            />
          </div>
          <div>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as 'date' | 'name')}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="date">Sort by Date</option>
              <option value="name">Sort by Name</option>
            </select>
          </div>
        </div>
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

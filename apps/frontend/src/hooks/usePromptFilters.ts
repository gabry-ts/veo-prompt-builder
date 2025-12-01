import { useState, useMemo } from 'react';
import type { Prompt } from '../types/prompt';

interface UsePromptFiltersResult {
  searchQuery: string;
  setSearchQuery: (value: string) => void;
  sortBy: 'date' | 'name';
  setSortBy: (value: 'date' | 'name') => void;
  filterTag: string;
  setFilterTag: (value: string) => void;
  showFavoritesOnly: boolean;
  setShowFavoritesOnly: (value: boolean) => void;
  allTags: string[];
  filteredAndSortedPrompts: Prompt[] | undefined;
}

export function usePromptFilters(prompts: Prompt[] | undefined): UsePromptFiltersResult {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<'date' | 'name'>('date');
  const [filterTag, setFilterTag] = useState<string>('');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  const allTags = useMemo(() => {
    const tags = new Set<string>();
    prompts?.forEach((prompt) => {
      prompt.tags.forEach((tag) => tags.add(tag));
    });
    return Array.from(tags).sort();
  }, [prompts]);

  const filteredAndSortedPrompts = prompts
    ?.filter((prompt) => {
      const searchLower = searchQuery.toLowerCase();
      const matchesSearch =
        prompt.name.toLowerCase().includes(searchLower) ||
        prompt.description?.toLowerCase().includes(searchLower) ||
        prompt.tags.some((tag) => tag.toLowerCase().includes(searchLower));

      const matchesTag = filterTag === '' || prompt.tags.includes(filterTag);
      const matchesFavorite = !showFavoritesOnly || prompt.isFavorite;

      return matchesSearch && matchesTag && matchesFavorite;
    })
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      }
      return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
    });

  return {
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
  };
}

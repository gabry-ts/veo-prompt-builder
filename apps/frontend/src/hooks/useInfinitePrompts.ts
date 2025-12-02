import { useInfiniteQuery } from '@tanstack/react-query';
import { promptService } from '../services/promptService';
import type { Prompt } from '../types/prompt';

export function useInfinitePrompts() {
  return useInfiniteQuery({
    queryKey: ['prompts', 'infinite'],
    queryFn: ({ pageParam }) => promptService.getPaginated(pageParam, 20),
    getNextPageParam: (lastPage) => {
      return lastPage.hasMore ? lastPage.nextCursor : undefined;
    },
    initialPageParam: undefined as string | undefined,
    select: (data) => ({
      pages: data.pages,
      pageParams: data.pageParams,
      // Flatten all prompts from all pages
      allPrompts: data.pages.flatMap((page) => page.data) as Prompt[],
    }),
  });
}

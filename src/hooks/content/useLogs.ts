import React from 'react';
import { api } from '@/api';
import { useInfiniteQuery } from '@tanstack/react-query';

const useLogs = (enabled: boolean = true) => {
  const {
    data,
    fetchNextPage: loadMoreLogs,
    hasNextPage,
    isPending,
    isFetchingNextPage
  } = useInfiniteQuery({
    queryKey: ['logs'],
    queryFn: ({ pageParam = 1 }) => api.admin.logger.findPaginated(pageParam, 50, 'DESC'),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : null),
    enabled
  });

  return {
    logs: data?.pages.flatMap((group) => group.data) || [],
    isPending,
    loadMoreLogs,
    hasNextPage
  };
};

export default useLogs;

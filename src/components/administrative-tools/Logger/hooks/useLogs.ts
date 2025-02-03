import { api } from '@/api';
import { transformDateTime } from '@/utils/date.utils';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import { useState, useEffect } from 'react';

const useLogs = (enabled: boolean = true) => {
  const [afterDate, setAfterDate] = useState<string>();

  const { data: firstPage, isLoading: isFirstPageLoading } = useQuery({
    queryKey: ['logs', 'initial'],
    queryFn: () => api.admin.logger.findPaginatedAfterSpecificDate(1, 50, 'DESC', 'loggedAt'),
    enabled
  });

  useEffect(() => {
    if (firstPage && firstPage.data.length > 0) {
      if (firstPage.data[0].loggedAt) setAfterDate(transformDateTime(firstPage.data[0].loggedAt));
    }
  }, [firstPage]);

  const {
    data,
    fetchNextPage: loadMoreLogs,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    refetch: refetchLogs
  } = useInfiniteQuery({
    queryKey: ['logs', afterDate],
    queryFn: ({ pageParam = 1 }) =>
      api.admin.logger.findPaginatedAfterSpecificDate(pageParam, 50, 'DESC', 'id', afterDate),
    initialPageParam: 1,
    getNextPageParam: (lastPage) => (lastPage.meta.hasNextPage ? lastPage.meta.page + 1 : null),
    enabled: enabled && !!afterDate
  });

  return {
    logs: data?.pages.flatMap((group) => group.data) || [],
    isPending: isPending || isFirstPageLoading || isFetchingNextPage,
    loadMoreLogs,
    hasNextPage,
    refetchLogs
  };
};

export default useLogs;

import { api } from '@/api';
import { transformDateTime } from '@/utils/date.utils';
import { useQuery, useInfiniteQuery } from '@tanstack/react-query';
import React, { useState, useEffect } from 'react';

const useLogs = (
  sortKey?: string,
  order?: 'ASC' | 'DESC',
  startDate?: Date,
  endDate?: Date,
  enabled: boolean = true
) => {
  const startDateString = startDate ? transformDateTime(startDate.toISOString()) : undefined;
  const endDateString = endDate ? transformDateTime(endDate.toISOString()) : undefined;

  const [afterDate, setAfterDate] = useState<string>();

  const { data: firstPage, isLoading: isFirstPageLoading } = useQuery({
    queryKey: ['logs', 'initial', sortKey, order],
    queryFn: () =>
      api.admin.logger.findPaginatedRawFunction({
        page: '1',
        limit: '50',
        sort: 'loggedAt,DESC',
        join: 'user'
      }),
    enabled
  });

  useEffect(() => {
    if (firstPage && firstPage.data.length > 0) {
      if (firstPage.data[0].loggedAt) setAfterDate(transformDateTime(firstPage.data[0].loggedAt));
    }
  }, [firstPage]);

  const filter = React.useMemo(() => {
    if (startDateString && endDateString) {
      return `loggedAt||$between||${startDateString},${endDateString}`;
    } else if (startDateString) {
      return `loggedAt||$between||${startDateString},${afterDate}`;
    } else if (endDateString) {
      return `loggedAt||$lte||${endDateString}`;
    }
    return `loggedAt||$lte||${afterDate}`;
  }, [startDateString, endDateString, afterDate]);

  const {
    data,
    fetchNextPage: loadMoreLogs,
    hasNextPage,
    isPending,
    isFetchingNextPage,
    refetch: refetchLogs
  } = useInfiniteQuery({
    queryKey: ['logs', afterDate, sortKey, order, startDateString, endDateString],
    queryFn: ({ pageParam = 1 }) =>
      api.admin.logger.findPaginatedRawFunction({
        page: pageParam.toString(),
        limit: '50',
        sort: 'loggedAt,DESC',
        filter,
        join: 'user'
      }),
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

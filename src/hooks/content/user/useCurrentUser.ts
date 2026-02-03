import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

export const useCurrentUser = (enabled: boolean = true) => {
  const {
    data: userResp,
    isFetching: isFetchUserPending,
    refetch: refetchUser
  } = useQuery({
    queryKey: ['current-user'],
    queryFn: () => api.user.findById(api.auth.getCurrentUserId()),
    enabled: typeof localStorage != 'undefined' && enabled
  });

  const user = React.useMemo(() => {
    if (!userResp) return null;
    return userResp;
  }, [userResp]);

  return {
    user,
    isFetchUserPending,
    refetchUser
  };
};

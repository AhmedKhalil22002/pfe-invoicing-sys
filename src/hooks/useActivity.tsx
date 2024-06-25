
import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const useActivity = () => {
  const { isPending: isFetchActivitiesPending, data: activitiesResp } = useQuery({
    queryKey: ['activities'],
    queryFn: () => api.activity.find()
  });

  const activities = React.useMemo(() => {
    if (!activitiesResp) return [];
    return activitiesResp;
  }, [activitiesResp]);

  return {
    activities,
    isFetchActivitiesPending,
  };
};

export default useActivity;

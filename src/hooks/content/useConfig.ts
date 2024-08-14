import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const useConfig = (keys?: string[]) => {
  const { isPending, data } = useQuery({
    queryKey: ['app-config'],
    queryFn: () => api.appConfig.find(keys)
  });

  const configs = React.useMemo(() => {
    if (!data) return [];
    return data.map((config) => {
      return { key: config.key, value: config.value };
    });
  }, [data]);

  return {
    configs,
    isPending
  };
};

export default useConfig;

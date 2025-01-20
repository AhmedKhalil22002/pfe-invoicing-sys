import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const useLogger = (enabled: boolean = true) => {
  const { isPending: isFetchLoggerPending, data: loggerResp } = useQuery({
    queryKey: ['currencies'],
    queryFn: () => api.admin.logger.find(),
    enabled
  });

  const logs = React.useMemo(() => {
    if (!loggerResp) return [];
    return loggerResp;
  }, [loggerResp]);

  return {
    logs,
    isFetchLoggerPending
  };
};

export default useLogger;

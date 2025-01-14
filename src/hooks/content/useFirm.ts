import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const useFirm = (id: number) => {
  const { isPending: isFetchFirmPending, data: firmResp } = useQuery({
    queryKey: ['selected-firm'],
    queryFn: () => api.firm.findOne(id)
  });

  const firm = React.useMemo(() => {
    if (!firmResp) return null;
    return firmResp;
  }, [firmResp]);

  return {
    firm,
    isFetchFirmPending
  };
};

export default useFirm;

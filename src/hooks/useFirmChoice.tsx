import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const useFirmChoice = () => {
  const { isPending: isFetchFirmsPending, data: firmsResp } = useQuery({
    queryKey: ['choiceFirms'],
    queryFn: () => api.firm.findChoice(),
    retry: 1,
    refetchOnWindowFocus: false
  });

  const firms = React.useMemo(() => {
    if (!firmsResp) return [];
    return firmsResp;
  }, [firmsResp]);

  return {
    firms,
    isFetchFirmsPending
  };
};

export default useFirmChoice;

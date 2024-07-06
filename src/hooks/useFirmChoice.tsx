import React from 'react';
import { FirmQueryKeyParams, api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const useFirmChoices = (params: FirmQueryKeyParams) => {
  const { isPending: isFetchFirmsPending, data: firmsResp } = useQuery({
    queryKey: ['choiceFirms'],
    queryFn: () => api.firm.findChoices(params),
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

export default useFirmChoices;

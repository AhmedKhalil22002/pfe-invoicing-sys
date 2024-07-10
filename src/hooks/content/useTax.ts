import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const useTax = () => {
  const { isPending: isFetchTaxesPending, data: taxesResp } = useQuery({
    queryKey: ['taxes'],
    queryFn: () => api.tax.find(),
    retry: 1,
    refetchOnWindowFocus: false
  });

  const taxes = React.useMemo(() => {
    if (!taxesResp) return [];
    return taxesResp;
  }, [taxesResp]);

  return {
    taxes,
    isFetchTaxesPending
  };
};

export default useTax;

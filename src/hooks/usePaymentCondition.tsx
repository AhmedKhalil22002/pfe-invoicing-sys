import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const usePaymentCondition = () => {
  const { isPending: isFetchPaymentConditionsPending, data: paymentConditionsResp } = useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => api.paymentCondition.find(),
    retry: 1,
    refetchOnWindowFocus: false
  });

  const paymentConditions = React.useMemo(() => {
    if (!paymentConditionsResp) return [];
    return paymentConditionsResp;
  }, [paymentConditionsResp]);

  return {
    paymentConditions,
    isFetchPaymentConditionsPending,
  };
};

export default usePaymentCondition;
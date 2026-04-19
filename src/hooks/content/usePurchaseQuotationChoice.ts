import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';
import { PURCHASE_QUOTATION_STATUS } from '@/types';

const usePurchaseQuotationChoices = (status: PURCHASE_QUOTATION_STATUS, enabled: boolean = true) => {
  const { isPending: isFetchPurchaseQuotationPending, data: purchaseQuotationsResp } = useQuery({
    queryKey: ['purchase-quotation-choices', status],
    queryFn: () => api.purchaseQuotation.findChoices(status),
    enabled: enabled
  });

  const purchaseQuotations = React.useMemo(() => {
    if (!purchaseQuotationsResp) return [];
    return purchaseQuotationsResp;
  }, [purchaseQuotationsResp]);

  return {
    purchaseQuotations,
    isFetchPurchaseQuotationPending
  };
};

export default usePurchaseQuotationChoices;

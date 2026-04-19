import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const usePurchaseInvoice = (id: number, enabled: boolean = true) => {
  const { isPending: isFetchPurchaseInvoicePending, data: purchaseInvoiceResp } = useQuery({
    queryKey: [`purchase-invoice-${id}`],
    queryFn: () => api.purchaseInvoice.findOne(id),
    enabled: !!id && enabled
  });

  const purchaseInvoice = React.useMemo(() => {
    if (!purchaseInvoiceResp) return null;
    return purchaseInvoiceResp;
  }, [purchaseInvoiceResp]);

  return {
    purchaseInvoice,
    isFetchPurchaseInvoicePending
  };
};

export default usePurchaseInvoice;

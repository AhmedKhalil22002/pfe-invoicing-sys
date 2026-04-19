import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const usePurchaseInvoiceRangeDates = (id?: number, enabled: boolean = true) => {
  const { isLoading: isFetchPurchaseInvoiceRangePending, data: purchaseInvoiceRangeResp } = useQuery({
    queryKey: [`purchase-invoice-range-${id}`],
    queryFn: () => api.purchaseInvoice.findByRange(id),
    enabled: !!id && enabled
  });

  const dateRange = React.useMemo(() => {
    if (!purchaseInvoiceRangeResp) return {};
    //previous date
    const previousDate = purchaseInvoiceRangeResp.previous?.date
      ? new Date(purchaseInvoiceRangeResp.previous.date)
      : undefined;

    //next date
    const nextDate = purchaseInvoiceRangeResp.next?.date ? new Date(purchaseInvoiceRangeResp.next.date) : undefined;

    return {
      from: previousDate,
      to: nextDate
    };
  }, [purchaseInvoiceRangeResp]);

  return {
    dateRange,
    isFetchPurchaseInvoiceRangePending
  };
};

export default usePurchaseInvoiceRangeDates;

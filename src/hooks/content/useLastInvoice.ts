import React from 'react';
import { api } from '@/api';
import { useQuery } from '@tanstack/react-query';

const useLastInvoice = () => {
  const { isPending: isFetchLastInvoicePending, data: lastInvoiceResp } = useQuery({
    queryKey: ['last-invoice'],
    queryFn: () => api.quotation.findPaginated(1, 1, 'DESC', 'date')
  });

  const lastInvoice = React.useMemo(() => {
    if (!lastInvoiceResp) return null;
    return lastInvoiceResp.data[0] || null;
  }, [lastInvoiceResp]);

  return {
    lastInvoice,
    isFetchLastInvoicePending
  };
};

export default useLastInvoice;

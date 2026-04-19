import React from 'react';

interface PurchaseQuotationActionsContextProps {
  openDeleteDialog?: () => void;
  openDuplicateDialog?: () => void;
  openDownloadDialog?: () => void;
  openInvoiceDialog?: () => void;
  searchTerm?: string;
  setSearchTerm?: (value: string) => void;
  page?: number;
  totalPageCount?: number;
  setPage?: (value: number) => void;
  size?: number;
  setSize?: (value: number) => void;
  order?: boolean;
  sortKey?: string;
  setSortDetails?: (order: boolean, sortKey: string) => void;
  firmId?: number;
  interlocutorId?: number;
}

export const PurchaseQuotationActionsContext = React.createContext<PurchaseQuotationActionsContextProps>({});

export const usePurchaseQuotationActions = () => React.useContext(PurchaseQuotationActionsContext);

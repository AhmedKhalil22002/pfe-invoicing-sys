import React from 'react';
import { useRouter } from 'next/router';
import { toast } from 'sonner';
import { useDebounce } from '@/hooks/other/useDebounce';
import { api } from '@/api';
import { getErrorMessage } from '@/utils/errors';
import { useMutation, useQuery } from '@tanstack/react-query';
import { PurchaseQuotationDuplicateDialog } from './dialogs/PurchaseQuotationDuplicateDialog';
import { useTranslation } from 'react-i18next';
import { PurchaseQuotationDeleteDialog } from './dialogs/PurchaseQuotationDeleteDialog';
import { PurchaseQuotationDownloadDialog } from './dialogs/PurchaseQuotationDownloadDialog';
import { PurchaseQuotationInvoiceDialog } from './dialogs/PurchaseQuotationInvoiceDialog';
import { getPurchaseQuotationColumns } from './data-table/columns';
import { usePurchaseQuotationManager } from './hooks/usePurchaseQuotationManager';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { DuplicatePurchaseQuotationDto, PurchaseQuotation } from '@/types';
import { useIntro } from '@/context/IntroContext';
import { DataTable } from '@/components/shared/data-table/data-table';
import { DataTableConfig } from '@/components/shared/data-table/types';

interface PurchaseQuotationMainProps {
  className?: string;
}

export const PurchaseQuotationMain: React.FC<PurchaseQuotationMainProps> = ({ className }) => {
  const router = useRouter();
  const { t: tCommon, ready: commonReady } = useTranslation('common');
  const { t: tInvoicing, ready: invoicingReady } = useTranslation('invoicing');
  const { setIntro } = useIntro();
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setIntro?.(tInvoicing('purchaseQuotation.singular'), tInvoicing('purchaseQuotation.card_description'));
    setRoutes?.([
      { title: tCommon('menu.buying'), href: '/buying' },
      { title: tCommon('submenu.quotations') }
    ]);
  }, [router.locale]);

  const purchaseQuotationManager = usePurchaseQuotationManager();

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [sortDetails, setSortDetails] = React.useState({ order: true, sortKey: 'id' });
  const { value: debouncedSortDetails, loading: sorting } = useDebounce<typeof sortDetails>(
    sortDetails,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const { value: debouncedSearchTerm, loading: searching } = useDebounce<string>(searchTerm, 500);

  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [duplicateDialog, setDuplicateDialog] = React.useState(false);
  const [downloadDialog, setDownloadDialog] = React.useState(false);
  const [invoiceDialog, setInvoiceDialog] = React.useState(false);

  const {
    isPending: isFetchPending,
    error,
    data: purchaseQuotationsResp,
    refetch: refetchPurchaseQuotations
  } = useQuery({
    queryKey: [
      'purchaseQuotations',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.purchaseQuotation.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm,
        ['firm', 'interlocutor', 'currency']
      )
  });

  const purchaseQuotations = React.useMemo(() => {
    return purchaseQuotationsResp?.data || [];
  }, [purchaseQuotationsResp]);

  const context: DataTableConfig<PurchaseQuotation> = {
    singularName: tInvoicing('purchaseQuotation.singular'),
    pluralName: tInvoicing('purchaseQuotation.plural'),

    //dialogs
    createCallback: () => {
      router.push('/buying/new-quotation');
    },
    updateCallback: (purchaseQuotation: PurchaseQuotation) => {
      router.push(`/buying/purchase-quotation-portal/${purchaseQuotation.id}`);
    },
    deleteCallback: () => setDeleteDialog(true),
    openInvoiceDialog: () => setInvoiceDialog(true),
    openDownloadDialog: () => setDownloadDialog(true),
    openDuplicateDialog: () => setDuplicateDialog(true),
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: purchaseQuotationsResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey })
  };

  //Remove PurchaseQuotation
  const { mutate: removePurchaseQuotation, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.purchaseQuotation.remove(id),
    onSuccess: () => {
      if (purchaseQuotations?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tInvoicing('purchaseQuotation.action_remove_success'));
      refetchPurchaseQuotations();
      setDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('purchaseQuotation.action_remove_failure'))
      );
    }
  });

  //Duplicate PurchaseQuotation
  const { mutate: duplicatePurchaseQuotation, isPending: isDuplicationPending } = useMutation({
    mutationFn: (duplicatePurchaseQuotationDto: DuplicatePurchaseQuotationDto) =>
      api.purchaseQuotation.duplicate(duplicatePurchaseQuotationDto),
    onSuccess: async (data) => {
      toast.success(tInvoicing('purchaseQuotation.action_duplicate_success'));
      await router.push('/buying/purchase-quotation-portal/' + data.id);
      setDuplicateDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('purchaseQuotation.action_duplicate_failure'))
      );
    }
  });

  //Download PurchaseQuotation
  const { mutate: downloadPurchaseQuotation, isPending: isDownloadPending } = useMutation({
    mutationFn: (data: { id: number; template: string }) =>
      api.purchaseQuotation.download(data.id, data.template),
    onSuccess: () => {
      toast.success(tInvoicing('purchaseQuotation.action_download_success'));
      setDownloadDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('purchaseQuotation.action_download_failure'))
      );
    }
  });

  //Invoice PurchaseQuotation
  const { mutate: invoicePurchaseQuotation, isPending: isInvoicePending } = useMutation({
    mutationFn: (data: { id: number; createInvoice: boolean }) =>
      api.purchaseQuotation.invoice(data.id, data.createInvoice),
    onSuccess: () => {
      toast.success(tInvoicing('purchaseQuotation.action_invoice_success'));
      refetchPurchaseQuotations();
      setInvoiceDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('purchaseQuotation.action_invoice_failure'))
      );
    }
  });


  const isPending =
    isFetchPending ||
    isDeletePending ||
    paging ||
    resizing ||
    searching ||
    sorting ||
    !commonReady ||
    !invoicingReady;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <>
      <PurchaseQuotationDeleteDialog
        id={purchaseQuotationManager?.id}
        sequential={purchaseQuotationManager?.sequential || ''}
        open={deleteDialog}
        deletePurchaseQuotation={() => {
          purchaseQuotationManager?.id && removePurchaseQuotation(purchaseQuotationManager?.id);
        }}
        isDeletionPending={isDeletePending}
        onClose={() => setDeleteDialog(false)}
      />
      <PurchaseQuotationDuplicateDialog
        id={purchaseQuotationManager?.id || 0}
        sequential={purchaseQuotationManager?.sequential || ''}
        open={duplicateDialog}
        duplicatePurchaseQuotation={(includeFiles: boolean) => {
          purchaseQuotationManager?.id &&
            duplicatePurchaseQuotation({
              id: purchaseQuotationManager?.id,
              includeFiles: includeFiles
            });
        }}
        isDuplicationPending={isDuplicationPending}
        onClose={() => setDuplicateDialog(false)}
      />
      <PurchaseQuotationDownloadDialog
        id={purchaseQuotationManager?.id || 0}
        open={downloadDialog}
        downloadPurchaseQuotation={(template: string) => {
          purchaseQuotationManager?.id && downloadPurchaseQuotation({ id: purchaseQuotationManager?.id, template });
        }}
        isDownloadPending={isDownloadPending}
        onClose={() => setDownloadDialog(false)}
      />
      <PurchaseQuotationInvoiceDialog
        id={purchaseQuotationManager?.id || 0}
        status={purchaseQuotationManager?.status || PURCHASE_QUOTATION_STATUS.Draft}
        sequential={purchaseQuotationManager?.sequential || ''}
        open={invoiceDialog}
        invoice={(id: number, createInvoice: boolean) => {
          invoicePurchaseQuotation({ id, createInvoice });
        }}
        isInvoicePending={isInvoicePending}
        onClose={() => setInvoiceDialog(false)}
      />
       <DataTable
        context={context}
        className="flex flex-col flex-1 overflow-hidden p-1"
        containerClassName="overflow-auto"
        data={purchaseQuotations}
        columns={getPurchaseQuotationColumns(tInvoicing, router)}
        isPending={isPending}
      />
    </>
  );
};

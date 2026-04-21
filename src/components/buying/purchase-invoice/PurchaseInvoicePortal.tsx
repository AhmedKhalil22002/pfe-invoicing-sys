import React from 'react';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { useRouter } from 'next/router';
import { useTranslation } from 'react-i18next';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { DuplicatePurchaseInvoiceDto, PurchaseInvoice } from '@/types';
import { usePurchaseInvoiceManager } from './hooks/usePurchaseInvoiceManager';
import { PurchaseInvoiceDeleteDialog } from './dialogs/PurchaseInvoiceDeleteDialog';
import { PurchaseInvoiceDuplicateDialog } from './dialogs/PurchaseInvoiceDuplicateDialog';
import { PurchaseInvoiceDownloadDialog } from './dialogs/PurchaseInvoiceDownloadDialog';
import { useIntro } from '@/context/IntroContext';
import { DataTable } from '@/components/shared/data-table/data-table';
import { cn } from '@/lib/utils';
import { usePurchaseInvoiceColumns } from './columns';
import { DataTableConfig } from '@/components/shared/data-table/types';
import { Copy, Printer } from 'lucide-react';

interface PurchaseInvoicePortalProps {
  className?: string;
  interlocutorId?: number;
  firmId?: number;
}

export const PurchaseInvoicePortal = ({ className, firmId, interlocutorId }: PurchaseInvoicePortalProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const { setRoutes, clearRoutes } = useBreadcrumb();
  const { setIntro, clearIntro } = useIntro();
  React.useEffect(() => {
    setIntro?.(
      tCommon('routes.buying.invoices.title'),
      tCommon('routes.buying.invoices.description')
    );
    setRoutes?.([
      { title: tCommon('menu.buying'), href: '/buying' },
      { title: tInvoicing('purchase_invoice.plural') }
    ]);
    return () => {
      clearIntro?.();
      clearRoutes?.();
    };
  }, [router.locale]);

  const purchaseInvoiceManager = usePurchaseInvoiceManager();

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

  const {
    isPending: isFetchPending,
    error,
    data: purchaseInvoicesResp,
    refetch: refetchPurchaseInvoices
  } = useQuery({
    queryKey: [
      'purchaseInvoices',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.purchaseInvoice.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm,
        ['firm', 'interlocutor', 'currency']
      )
  });

  const purchaseInvoices = React.useMemo(() => {
    return purchaseInvoicesResp?.data || [];
  }, [purchaseInvoicesResp]);

  //delete purchaseInvoice mutator
  const { mutate: removePurchaseInvoice, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.purchaseInvoice.remove(id),
    onSuccess: () => {
      if (purchaseInvoices?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tInvoicing('purchase_invoice.action_remove_success'));
      refetchPurchaseInvoices();
      setDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('purchase_invoice.action_remove_failure'))
      );
    }
  });

  //duplicate purchaseInvoice mutator
  const { mutate: duplicatePurchaseInvoice, isPending: isDuplicationPending } = useMutation({
    mutationFn: (duplicatePurchaseInvoiceDto: DuplicatePurchaseInvoiceDto) =>
      api.purchaseInvoice.duplicate(duplicatePurchaseInvoiceDto),
    onSuccess: (data) => {
      refetchPurchaseInvoices();
      toast.success(tInvoicing('purchase_invoice.action_duplicate_success'));
      router.push('/buying/invoice/' + data.id);
      setDuplicateDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('purchase_invoice.action_duplicate_failure'))
      );
    }
  });

  //Download purchaseInvoice
  const { mutate: downloadPurchaseInvoice, isPending: isDownloadPending } = useMutation({
    mutationFn: (data: { id: number; template: string }) =>
      api.purchaseInvoice.download(data.id, data.template),
    onSuccess: () => {
      toast.success(tInvoicing('purchase_invoice.action_download_success'));
      setDownloadDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('purchase_invoice.action_download_failure'))
      );
    }
  });

  const context: DataTableConfig<PurchaseInvoice> = {
    singularName: tInvoicing('purchase_invoice.singular'),
    pluralName: tInvoicing('purchase_invoice.plural'),
    inspectCallback: (purchaseInvoice: PurchaseInvoice) => {
      router.push('/buying/invoice/' + purchaseInvoice.id);
    },
    createCallback: () => {
      router.push('/buying/new-invoice');
    },
    updateCallback: (purchaseInvoice: PurchaseInvoice) => {
      router.push('/buying/invoice/' + purchaseInvoice.id);
    },
    deleteCallback: (purchaseInvoice: PurchaseInvoice) => {
      purchaseInvoiceManager.set('id', purchaseInvoice.id);
      purchaseInvoiceManager.set('sequential', purchaseInvoice.sequential);
      setDeleteDialog(true);
    },
    targetEntity: (purchaseInvoice: PurchaseInvoice) => {
      purchaseInvoiceManager.set('id', purchaseInvoice.id);
      purchaseInvoiceManager.set('sequential', purchaseInvoice.sequential);
    },
    additionalActions: {
      1: [
        {
          actionIcon: <Copy className="size-4" />,
          actionLabel: tCommon('commands.duplicate'),
          actionCallback: (purchaseInvoice: PurchaseInvoice) => {
            purchaseInvoiceManager.set('id', purchaseInvoice.id);
            purchaseInvoiceManager.set('sequential', purchaseInvoice.sequential);
            setDuplicateDialog(true);
          }
        },
        {
          actionIcon: <Printer className="size-4" />,
          actionLabel: tCommon('commands.download'),
          actionCallback: (purchaseInvoice: PurchaseInvoice) => {
            purchaseInvoiceManager.set('id', purchaseInvoice.id);
            setDownloadDialog(true);
          }
        }
      ]
    },
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: purchaseInvoicesResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey })
  };

  const columns = usePurchaseInvoiceColumns(context, firmId, interlocutorId);

  const isPending = isFetchPending || isDeletePending || paging || resizing || searching || sorting;

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className={cn('flex flex-col flex-1 overflow-hidden container mx-auto', className)}>
      <PurchaseInvoiceDeleteDialog
        id={purchaseInvoiceManager?.id || 0}
        sequential={purchaseInvoiceManager?.sequential || ''}
        open={deleteDialog}
        deletePurchaseInvoice={() => {
          purchaseInvoiceManager?.id && removePurchaseInvoice(purchaseInvoiceManager?.id);
        }}
        isDeletionPending={isDeletePending}
        onClose={() => setDeleteDialog(false)}
      />
      <PurchaseInvoiceDuplicateDialog
        id={purchaseInvoiceManager?.id || 0}
        sequential={purchaseInvoiceManager?.sequential || ''}
        open={duplicateDialog}
        duplicatePurchaseInvoice={(includeFiles: boolean) =>
          purchaseInvoiceManager?.id && duplicatePurchaseInvoice({ id: purchaseInvoiceManager.id, includeFiles })
        }
        isDuplicationPending={isDuplicationPending}
        onClose={() => setDuplicateDialog(false)}
      />
      <PurchaseInvoiceDownloadDialog
        id={purchaseInvoiceManager?.id || 0}
        open={downloadDialog}
        downloadPurchaseInvoice={(template: string) =>
          purchaseInvoiceManager?.id && downloadPurchaseInvoice({ id: purchaseInvoiceManager.id, template })
        }
        isDownloadPending={isDownloadPending}
        onClose={() => setDownloadDialog(false)}
      />
      <DataTable
        className="flex flex-col flex-1 overflow-auto p-1"
        containerClassName="overflow-auto"
        data={purchaseInvoices}
        columns={columns}
        context={context}
        isPending={isPending}
      />
    </div>
  );
};

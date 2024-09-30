import React from 'react';
import { PaymentCondition } from '@/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getErrorMessage } from '@/utils/errors';
import { useMutation, useQuery } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { PaymentConditionCreateDialog } from './dialogs/PaymentConditionCreateDialog';
import { PaymentConditionUpdateDialog } from './dialogs/PaymentConditionUpdateDialog';
import { PaymentConditionDeleteDialog } from './dialogs/PaymentConditionDeleteDialog';
import { usePaymentConditionManager } from './hooks/usePaymentConditionManager';
import { api } from '@/api';
import { PaymentConditionActionsContext } from './data-table/ActionsContext';
import { DataTable } from './data-table/data-table';
import { getPayementConditionColumns } from './data-table/columns';

interface PaymentConditionMainProps {
  className?: string;
}
const PaymentConditionMain: React.FC<PaymentConditionMainProps> = ({ className }) => {
  const { t: tSettings } = useTranslation('settings');

  const paymentConditionManager = usePaymentConditionManager();

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

  const [createDialog, setCreateDialog] = React.useState(false);
  const [updateDialog, setUpdateDialog] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState(false);

  const {
    isPending: isFetchPending,
    error,
    data: paymentConditionsResp,
    refetch: refetchPaymentConditions
  } = useQuery({
    queryKey: [
      'payment-conditions',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.paymentCondition.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm
      )
  });

  const paymentConditions = React.useMemo(() => {
    return paymentConditionsResp?.data || [];
  }, [paymentConditionsResp]);

  const context = {
    //dialogs
    openCreateDialog: () => setCreateDialog(true),
    openUpdateDialog: () => setUpdateDialog(true),
    openDeleteDialog: () => setDeleteDialog(true),
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: paymentConditionsResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey })
  };

  //create payment condition
  const { mutate: createPaymentCondition, isPending: isCreatePending } = useMutation({
    mutationFn: (data: PaymentCondition) => api.paymentCondition.create(data),
    onSuccess: () => {
      toast.success('Condition de Paiement ajoutée avec succès');
      refetchPaymentConditions();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('', error, 'Erreur lors de la création de la méthode de Paiement')
      );
    }
  });

  //update payment condition
  const { mutate: updatePaymentCondition, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: PaymentCondition) => api.paymentCondition.update(data),
    onSuccess: () => {
      toast.success('Condition de Paiement modifiée avec succès');
      refetchPaymentConditions();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('', error, 'Erreur lors de la modification de la méthode de Paiement')
      );
    }
  });

  //remove payment condition
  const { mutate: removePaymentCondition, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.paymentCondition.remove(id),
    onSuccess: () => {
      if (paymentConditions?.length == 1 && page > 1) setPage(page - 1);
      toast.success('Condition de Paiement supprimée avec succès');
      refetchPaymentConditions();
      setDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, "Erreur lors de la suppression de l'activité"));
    }
  });

  const handlePaymentConditionSubmit = (
    paymentCondition: PaymentCondition,
    callback: (paymentCondition: PaymentCondition) => void
  ): boolean => {
    const validation = api.paymentCondition.validate(paymentCondition);
    if (validation.message) {
      toast.error(validation.message);
      return false;
    } else {
      callback(paymentCondition);
      paymentConditionManager.reset();
      return true;
    }
  };

  const isPending =
    isFetchPending ||
    isCreatePending ||
    isUpdatePending ||
    isDeletePending ||
    paging ||
    resizing ||
    searching ||
    sorting;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <>
      <PaymentConditionCreateDialog
        open={createDialog}
        isCreatePending={isCreatePending}
        createPaymentCondition={() => {
          handlePaymentConditionSubmit(
            paymentConditionManager.getPaymentCondition(),
            createPaymentCondition
          ) && setCreateDialog(false);
        }}
        onClose={() => {
          setCreateDialog(false);
        }}
      />
      <PaymentConditionUpdateDialog
        open={updateDialog}
        updatePaymentCondition={() => {
          handlePaymentConditionSubmit(
            paymentConditionManager.getPaymentCondition(),
            updatePaymentCondition
          ) && setUpdateDialog(false);
        }}
        isUpdatePending={isUpdatePending}
        onClose={() => {
          setUpdateDialog(false);
        }}
      />
      <PaymentConditionDeleteDialog
        open={deleteDialog}
        deletePaymentCondition={() => {
          paymentConditionManager?.id && removePaymentCondition(paymentConditionManager?.id);
        }}
        isDeletionPending={isDeletePending}
        label={paymentConditionManager?.label}
        onClose={() => {
          setDeleteDialog(false);
        }}
      />
      <PaymentConditionActionsContext.Provider value={context}>
        <Card className={className}>
          <CardHeader>
            <CardTitle>{tSettings('payment_condition.singular')}</CardTitle>
            <CardDescription>{tSettings('payment_condition.card_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              className="my-5"
              data={paymentConditions}
              columns={getPayementConditionColumns(tSettings)}
              isPending={isPending}
            />
          </CardContent>
        </Card>
      </PaymentConditionActionsContext.Provider>
    </>
  );
};

export default PaymentConditionMain;

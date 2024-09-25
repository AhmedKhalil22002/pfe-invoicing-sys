import React from 'react';
import { PaymentCondition } from '@/types';
import { EmptyTable, PaginationControls } from '@/components/common';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import { getErrorMessage } from '@/utils/errors';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronUp,
  Grid2x2Check,
  MoreHorizontal,
  Search,
  Settings2,
  SquarePlus,
  Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { PaymentConditionCells } from './PaymentConditionCells';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { PAYMENT_CONDITIONS_COLUMNS } from './constants/payment-condition.constants';
import { PaymentConditionCreateDialog } from './dialogs/PaymentConditionCreateDialog';
import { PaymentConditionUpdateDialog } from './dialogs/PaymentConditionUpdateDialog';
import { PaymentConditionDeleteDialog } from './dialogs/PaymentConditionDeleteDialog';
import { usePaymentConditionManager } from './hooks/usePaymentConditionManager';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { api } from '@/api';

interface PaymentConditionMainProps {
  className?: string;
}
const PaymentConditionMain: React.FC<PaymentConditionMainProps> = ({ className }) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');

  const paymentConditionManager = usePaymentConditionManager();

  const columns = React.useMemo(() => {
    return PAYMENT_CONDITIONS_COLUMNS;
  }, []);

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [order, setOrder] = React.useState(true);
  const { value: debouncedOrder, loading: ordering } = useDebounce<boolean>(order, 500);

  const [sortKey, setSortKey] = React.useState('id');
  const { value: debouncedSortKey, loading: sorting } = useDebounce<string>(sortKey, 500);

  const [searchKey, setSearchKey] = React.useState('label');
  const { value: debouncedSearchKey, loading: searchingByKey } = useDebounce<string>(
    searchKey,
    500
  );

  const [searchTerm, setSearchTerm] = React.useState('');
  const { value: debouncedSearchTerm, loading: searchingByTerm } = useDebounce<string>(
    searchTerm,
    500
  );

  const [visibleColumns, setVisibleColumns] = React.useState(
    columns
      .map((col) => {
        return { [col.key]: col.default ? true : false };
      })
      .reduce((acc, current) => {
        const key = Object.keys(current)[0];
        acc[key] = current[key];
        return acc;
      }, {})
  );

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
      'activities',
      debouncedPage,
      debouncedSize,
      debouncedOrder,
      debouncedSortKey,
      debouncedSearchKey,

      debouncedSearchTerm
    ],
    queryFn: () =>
      api.paymentCondition.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedOrder ? 'ASC' : 'DESC',
        debouncedSortKey,
        debouncedSearchKey,
        debouncedSearchTerm
      )
  });

  const paymentConditions = React.useMemo(() => {
    if (!paymentConditionsResp) return [];
    return paymentConditionsResp.data;
  }, [paymentConditionsResp]);

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

  const dataBlock = React.useMemo(() => {
    return paymentConditions?.map((condition: PaymentCondition) => (
      <TableRow key={condition.id} className="w-full">
        <PaymentConditionCells visibleColumns={visibleColumns} paymentCondition={condition} />
        <TableCell className="flex justify-end">
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  paymentConditionManager.setPaymentCondition(condition);
                  setUpdateDialog(true);
                }}>
                <Settings2 className="h-5 w-5 mr-2" /> {tCommon('commands.modify')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  paymentConditionManager.setPaymentCondition(condition);
                  setDeleteDialog(true);
                }}>
                <Trash2 className="h-5 w-5 mr-2" /> {tCommon('commands.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [paymentConditions, visibleColumns, tCommon]);
  const loading =
    isFetchPending ||
    isCreatePending ||
    isUpdatePending ||
    isDeletePending ||
    paging ||
    resizing ||
    ordering ||
    searchingByKey ||
    searchingByTerm ||
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
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center gap-4">
                <div className="relative flex-1 md:grow-0 text-start">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    className="w-96 rounded-lg bg-background pl-8"
                    onChange={(e) => {
                      setPage(1);
                      setSearchTerm(e.target.value);
                    }}
                  />
                </div>
                <div className="flex items-center gap-2 w-full">
                  <Label>{tCommon('commands.search_sort_by')}</Label>
                  <Select
                    onValueChange={(value) => {
                      setSearchKey(value);
                    }}
                    value={searchKey}>
                    <SelectTrigger className="w-1/2 mx-2">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {columns.map((col) => {
                        if (col.canBeFiltred && visibleColumns[col.key])
                          return (
                            <SelectItem key={col.key} value={col.key}>
                              {tSettings(col.code)}
                            </SelectItem>
                          );
                      })}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-center w-full justify-end gap-2 ">
                  <Button className="flex gap-2" onClick={() => setCreateDialog(true)}>
                    {tSettings('payment_condition.new')}
                    <SquarePlus className="h-5 w-5" />
                  </Button>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="flex gap-2">
                        {tCommon('commands.display')}
                        <Grid2x2Check className="h-5 w-5" />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="mt-1 mr-5 w-fit">
                      <div className="grid gap-1">
                        {columns.map((col) => {
                          return (
                            <div key={col.key} className="flex gap-2 items-center">
                              <Checkbox
                                value={col.key}
                                checked={visibleColumns[col.key]}
                                onCheckedChange={(e) => {
                                  setVisibleColumns({ ...visibleColumns, [col.key]: e === true });
                                }}
                              />
                              <span className="text-sm font-medium">{tSettings(col.code)}</span>
                            </div>
                          );
                        })}
                      </div>
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Table shimmerClassName="w-full" count={size} isPending={loading}>
              <TableHeader>
                <TableRow>
                  {!loading &&
                    columns.map((col) => {
                      return (
                        <TableHead
                          hidden={visibleColumns[col.key] === false}
                          key={col.key}
                          onClick={() => {
                            setSortKey(col.key);
                            setOrder(!order);
                          }}>
                          <div className="flex items-center cursor-pointer w-fit">
                            {tSettings(col.code)}
                            {order && sortKey === col.key ? (
                              <ChevronDown className="w-4 h-4 ml-1" />
                            ) : (
                              <ChevronUp className="w-4 h-4 ml-1" />
                            )}
                          </div>
                        </TableHead>
                      );
                    })}
                  {!loading && (
                    <TableHead className="w-full flex items-center justify-end">Actions</TableHead>
                  )}
                </TableRow>
              </TableHeader>
              {paymentConditions.length === 0 ? (
                <EmptyTable message="Aucune Activité trouvée" visibleColumns={visibleColumns} />
              ) : (
                <TableBody>{dataBlock}</TableBody>
              )}
            </Table>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <div className="w-full flex items-center">
              <Label className="font-semibold text-sm mx-2">{tCommon('commands.display')}</Label>
              <Select
                onValueChange={(value) => {
                  setPage(1);
                  setSize(+value);
                }}>
                <SelectTrigger className="w-1/6">
                  <SelectValue placeholder={size} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                </SelectContent>
              </Select>
              <Label className="font-semibold text-sm mx-2">{tCommon('elements')}</Label>
            </div>
            <PaginationControls
              className="justify-end"
              hasNextPage={paymentConditionsResp?.meta.hasNextPage}
              hasPreviousPage={paymentConditionsResp?.meta.hasPreviousPage}
              page={page}
              pageCount={paymentConditionsResp?.meta.pageCount || 1}
              fetchCallback={(page: number) => setPage(page)}
            />
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default PaymentConditionMain;

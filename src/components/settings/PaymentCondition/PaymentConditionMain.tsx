import React from 'react';
import { PaymentCondition, api } from '@/api';
import { Container, EmptyTable, PaginationControls } from '@/components/common';
import { ChoiceDialog } from '@/components/dialogs/ChoiceDialog';
import { UpdateDialog } from '@/components/dialogs/UpdateDialog';
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
import { isAlphabeticOrSpace } from '@/utils/validations/string.validations';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Search,
  Settings2,
  Trash2,
  Wallet
} from 'lucide-react';
import { toast } from 'react-toastify';
import { PaymentConditionCells } from './PaymentConditionCells';
import { PaymentConditionForm } from './PaymentConditionForm';
import { useDebounce } from '@/hooks/other/useDebounce';
interface PaymentConditionMainProps {
  className?: string;
}
const PaymentConditionMain: React.FC<PaymentConditionMainProps> = ({ className }) => {
  const [formPaymentCondition, setFormPaymentCondition] = React.useState<PaymentCondition>(
    {} as PaymentCondition
  );
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [updateDialog, setUpdateDialog] = React.useState(false);
  const [selectedPaymentCondition, setSelectedPaymentCondition] =
    React.useState<PaymentCondition | null>(null);
  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);
  const [order, setOrder] = React.useState(true);
  const { value: debouncedOrder, loading: ordering } = useDebounce<boolean>(order, 500);
  const [search, setSearch] = React.useState('');
  const { value: debouncedSearch, loading: searching } = useDebounce<string>(search, 500);
  const [sortKey, setSortKey] = React.useState('label');
  const { value: debouncedSortKey, loading: sorting } = useDebounce<string>(sortKey, 500);

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
      debouncedSearch
    ],
    queryFn: () =>
      api.paymentCondition.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedOrder ? 'ASC' : 'DESC',
        debouncedSortKey,
        debouncedSearch
      )
  });

  const paymentConditions = React.useMemo(() => {
    if (!paymentConditionsResp) return [];
    return paymentConditionsResp.data;
  }, [paymentConditionsResp]);

  const { mutate: createPaymentCondition, isPending: isCreatePending } = useMutation({
    mutationFn: (data: PaymentCondition) => api.paymentCondition.create(data),
    onSuccess: () => {
      toast.success('Condition de Paiement ajoutée avec succès', { position: 'bottom-right' });
      refetchPaymentConditions();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('', error, 'Erreur lors de la création de la méthode de Paiement'),
        {
          position: 'bottom-right'
        }
      );
    }
  });

  const { mutate: updatePaymentCondition, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: PaymentCondition) => api.paymentCondition.update(data),
    onSuccess: () => {
      toast.success('Condition de Paiement modifiée avec succès', { position: 'bottom-right' });
      refetchPaymentConditions();
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('', error, 'Erreur lors de la modification de la méthode de Paiement'),
        {
          position: 'bottom-right'
        }
      );
    }
  });

  const { mutate: removePaymentCondition, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.paymentCondition.remove(id),
    onSuccess: () => {
      if (paymentConditions?.length == 1 && page > 1) setPage(page - 1);
      toast.success('Condition de Paiement supprimée avec succès', { position: 'bottom-right' });
      refetchPaymentConditions();
      setSelectedPaymentCondition(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, "Erreur lors de la suppression de l'activité"), {
        position: 'bottom-right'
      });
    }
  });

  const validateForm = (paymentCondition: PaymentCondition | null) => {
    if (
      paymentCondition &&
      paymentCondition?.label &&
      paymentCondition?.label?.length > 3 &&
      isAlphabeticOrSpace(paymentCondition?.label)
    ) {
      return '';
    }
    return 'Veuillez entrer un titre valide';
  };

  const handlePaymentConditionForm = async (
    paymentCondition: PaymentCondition | null,
    callback: (paymentCondition: PaymentCondition) => void
  ) => {
    const message = validateForm(paymentCondition);
    if (message) toast.error(message, { position: 'bottom-right' });
    else paymentCondition && callback(paymentCondition);
  };

  const dataBlock = React.useMemo(() => {
    return paymentConditions?.map((condition: PaymentCondition) => (
      <TableRow key={condition.id} className="w-full">
        <PaymentConditionCells paymentCondition={condition} />
        <TableCell>
          <DropdownMenu>
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
                  setSelectedPaymentCondition(condition);
                  setUpdateDialog(true);
                }}>
                <Settings2 className="h-5 w-5 mr-2" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedPaymentCondition(condition);
                  setDeleteDialog(true);
                }}>
                <Trash2 className="h-5 w-5 mr-2" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [paymentConditions]);
  const loading =
    isFetchPending ||
    isCreatePending ||
    isUpdatePending ||
    isDeletePending ||
    paging ||
    resizing ||
    ordering ||
    searching ||
    sorting;
  if (error) return 'An error has occurred: ' + error.message;
  return (
    <>
      <ChoiceDialog
        open={deleteDialog}
        label="Suppression de méthode de Paiement"
        description={
          <div>
            Voulez-vous vraiment supprimer la méthode de paiement avec l&apos;étiquette{' '}
            <span className="font-semibold">{selectedPaymentCondition?.label}</span>
          </div>
        }
        onClose={() => setDeleteDialog(false)}
        positiveCallback={() => {
          selectedPaymentCondition && removePaymentCondition(selectedPaymentCondition?.id || -1);
        }}
      />
      <UpdateDialog
        open={updateDialog}
        form={
          <PaymentConditionForm
            paymentCondition={selectedPaymentCondition}
            onPaymentConditionChange={(condition: PaymentCondition) =>
              setSelectedPaymentCondition(condition)
            }
          />
        }
        label="Modification de la méthode de Paiement"
        onClose={() => setUpdateDialog(false)}
        positiveCallback={() => {
          handlePaymentConditionForm(selectedPaymentCondition, updatePaymentCondition);
        }}
      />
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <Wallet className="h-6 w-6 mr-2" />
                Nouvelle Condition de Paiement
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <PaymentConditionForm
              paymentCondition={formPaymentCondition}
              onPaymentConditionChange={(condition: PaymentCondition) =>
                setFormPaymentCondition(condition)
              }
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button
              onClick={() => {
                handlePaymentConditionForm(formPaymentCondition, createPaymentCondition);
              }}>
              Enregistrer
            </Button>
          </CardFooter>
        </Card>
        <Container className="w-full mt-5">
          <div className="flex flex-row m-4 justify-between">
            <div className="relative flex-1 md:grow-0 text-start">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                className="w-96 rounded-lg bg-background pl-8"
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            <div className="w-full flex items-center justify-end">
              <Label className="font-semibold text-sm mx-2">Afficher</Label>
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
              <Label className="font-semibold text-sm mx-2">éléments</Label>
            </div>
          </div>
          <Table shimmerClassName="w-full" count={size} isPending={loading}>
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow>
                {!loading && (
                  <>
                    <TableHead className="w-2/6">
                      <div
                        className="flex items-center cursor-pointer w-fit"
                        onClick={() => {
                          setSortKey('label');
                          setOrder(!order);
                        }}>
                        Titre
                        {order && sortKey === 'label' ? (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </TableHead>
                    <TableHead className="w-4/6">
                      <div
                        className="flex items-center cursor-pointer w-fit"
                        onClick={() => {
                          setSortKey('description');
                          setOrder(!order);
                        }}>
                        Description
                        {order && sortKey === 'description' ? (
                          <ChevronDown className="w-4 h-4 ml-1" />
                        ) : (
                          <ChevronUp className="w-4 h-4 ml-1" />
                        )}
                      </div>
                    </TableHead>
                  </>
                )}

                <TableHead className="w-1/12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {!paymentConditions?.length ? (
              <EmptyTable message="Aucune Condition de paiement trouvée" colSpan={2} />
            ) : (
              <TableBody>{dataBlock}</TableBody>
            )}
          </Table>
          <PaginationControls
            className="mt-5 justify-end"
            hasNextPage={paymentConditionsResp?.meta.hasNextPage}
            hasPreviousPage={paymentConditionsResp?.meta.hasPreviousPage}
            page={page}
            pageCount={paymentConditionsResp?.meta.pageCount || 1}
            fetchCallback={(page: number) => setPage(page)}
          />
        </Container>
      </div>
    </>
  );
};

export default PaymentConditionMain;

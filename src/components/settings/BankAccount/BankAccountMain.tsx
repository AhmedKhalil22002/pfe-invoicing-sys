import React from 'react';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  BANK_ACCOUNT_COLUMNS,
  BankAccount,
  CreateBankAccountDto,
  UpdateBankAccountDto,
  api
} from '@/api';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/errors';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Search,
  Settings2,
  Telescope,
  Trash2,
  LucideBanknote
} from 'lucide-react';
import { BreadcrumbCommon, EmptyTable, PaginationControls, Spinner } from '@/components/common';
import { ChoiceDialog } from '@/components/dialogs/ChoiceDialog';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { BankAccountCells } from './BankAccountCells';
import { Checkbox } from '@/components/ui/checkbox';
import { BankAccountForm } from './BankAccountForm';
import useCurrency from '@/hooks/content/useCurrency';
import { useDebounce } from '@/hooks/other/useDebounce';
import useBankAccountInput from '@/hooks/functions/useBankAccountInput';

interface BankAccountMainProps {
  className?: string;
}

export const BankAccountMain: React.FC<BankAccountMainProps> = ({ className }) => {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);
  const [order, setOrder] = React.useState(true);
  const { value: debouncedOrder, loading: ordering } = useDebounce<boolean>(order, 500);
  const [search, setSearch] = React.useState('');
  const { value: debouncedSearch, loading: searching } = useDebounce<string>(search, 500);
  const [sortKey, setSortKey] = React.useState('[name]');
  const { value: debouncedSortKey, loading: sorting } = useDebounce<string>(sortKey, 500);
  const [visibleColumns, setVisibleColumns] = React.useState(
    BANK_ACCOUNT_COLUMNS.map((col) => {
      return { [col.key]: col.default ? true : false };
    }).reduce((acc, current) => {
      const key = Object.keys(current)[0];
      acc[key] = current[key];
      return acc;
    }, {})
  );
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [selectedAccount, setSelectedAccount] = React.useState<BankAccount | undefined>(undefined);

  const bankAccountManager = useBankAccountInput(selectedAccount || api.bankAccount.factory());

  const { currencies, isFetchCurrenciesPending } = useCurrency();

  const {
    isPending: isFetchPending,
    error,
    data: bankAccountsResp,
    refetch: refetchBankAccounts
  } = useQuery({
    queryKey: [
      'bank-accounts',
      debouncedPage,
      debouncedSize,
      debouncedOrder,
      debouncedSortKey,
      debouncedSearch
    ],
    queryFn: () =>
      api.bankAccount.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedOrder ? 'ASC' : 'DESC',
        debouncedSortKey,
        debouncedSearch
      )
  });

  const bankAccounts = React.useMemo(() => {
    if (!bankAccountsResp) return [];
    return bankAccountsResp.data;
  }, [bankAccountsResp]);

  const { mutate: createBankAccount, isPending: isCreatePending } = useMutation({
    mutationFn: (data: CreateBankAccountDto) => api.bankAccount.create(data),
    onSuccess: () => {
      toast.success('Compte Bancaire ajouté avec succès', { position: 'bottom-right' });
      refetchBankAccounts();
      reset();
    },
    onError: (error) => {
      const message = getErrorMessage(error, 'Erreur lors de la création du compte bancaire');
      toast.error(message, {
        position: 'bottom-right'
      });
    }
  });
  const { mutate: updateBankAccount, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: UpdateBankAccountDto) => api.bankAccount.update(data),
    onSuccess: () => {
      setSelectedAccount(undefined);
      toast.success('Compte Bancaire modifié avec succès', { position: 'bottom-right' });
      reset();
      refetchBankAccounts();
    },
    onError: (error) => {
      const message = getErrorMessage(error, 'Erreur lors de la modification du compte bancaire');
      toast.error(message, {
        position: 'bottom-right'
      });
    }
  });

  const reset = () => {
    setSelectedAccount(undefined);
    bankAccountManager.setEntireBankAccount(undefined);
  };

  const handleSubmit = () => {
    const data = { ...bankAccountManager.bankAccount } as BankAccount;
    const validation = api.bankAccount.validate(data);
    if (validation.message)
      toast.error(validation.message, {
        position: validation.position || 'bottom-right'
      });
    else {
      if (selectedAccount) updateBankAccount(data);
      else {
        createBankAccount(data);
      }
    }
  };

  const { mutate: removeBankAccount, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.bankAccount.remove(id),
    onSuccess: () => {
      if (bankAccounts?.length == 1 && page > 1) setPage(page - 1);
      toast.success('Compte Bancaire supprimée avec succès', { position: 'bottom-right' });
      refetchBankAccounts();
      setSelectedAccount(undefined);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Erreur lors de la suppression du compte bancaire'), {
        position: 'bottom-right'
      });
    }
  });

  const dataBlock = React.useMemo(() => {
    return bankAccounts?.map((account: BankAccount) => (
      <TableRow key={account.id}>
        <BankAccountCells bankAccount={account} visibleColumns={visibleColumns} />
        <TableCell className="flex">
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
                  setSelectedAccount(account);
                  bankAccountManager.setEntireBankAccount(account);
                }}>
                <Settings2 className="h-5 w-5 mr-2" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedAccount(account);
                  setDeleteDialog(true);
                }}>
                <Trash2 className="h-5 w-5 mr-2" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [bankAccounts, visibleColumns]);

  const loading =
    isFetchPending ||
    isDeletePending ||
    paging ||
    resizing ||
    ordering ||
    searching ||
    sorting ||
    isFetchCurrenciesPending;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className={cn('overflow-auto mx-10 mt-10', className)}>
      <ChoiceDialog
        open={deleteDialog}
        label="Suppression de le Compte Bancaire"
        description={
          <>
            Voulez-vous vraiment supprimer le Compte Bancaire dont l&apos;IBAN est{' '}
            <span className="font-semibold">{selectedAccount?.iban}</span>
          </>
        }
        onClose={() => setDeleteDialog(false)}
        positiveCallback={() => {
          selectedAccount && removeBankAccount(selectedAccount?.id || -1);
        }}
      />
      <Card>
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <LucideBanknote className="h-6 w-6 mr-2" />
              Nouveau Compte Bancaire
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <BankAccountForm bankAccountManager={bankAccountManager} currencies={currencies} />
        </CardContent>
        <CardFooter className="border-t px-6 py-4 gap-2">
          <Button onClick={handleSubmit}>
            Enregistrer{' '}
            <Spinner className="ml-2" size={'small'} show={isCreatePending || isUpdatePending} />
          </Button>
          <Button variant="secondary" onClick={reset}>
            Annuler
          </Button>
        </CardFooter>
      </Card>
      <Card className="w-full mt-5">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center">
              <div className="relative flex-1 md:grow-0 text-start">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  className="w-96 rounded-lg bg-background pl-8"
                  onChange={(e) => {
                    setSortKey('[name]');
                    setSearch(e.target.value);
                  }}
                />
              </div>
              <div className="w-full flex items-center justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="mx-4">
                      Affichage des colonnes
                      <ChevronDown className="h-5 w-5 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="mt-1 mr-5 w-fit">
                    <div className="grid gap-1">
                      {BANK_ACCOUNT_COLUMNS.map((col) => {
                        return (
                          <div key={col.key} className="flex gap-2 items-center">
                            <Checkbox
                              value={col.key}
                              checked={visibleColumns[col.key]}
                              onCheckedChange={(e) => {
                                setVisibleColumns({ ...visibleColumns, [col.key]: e === true });
                              }}
                            />
                            <span className="text-sm font-medium">{col.name}</span>
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
                  BANK_ACCOUNT_COLUMNS.map((col) => {
                    return (
                      <TableHead
                        hidden={visibleColumns[col.key] === false}
                        key={col.key}
                        onClick={() => {
                          setSortKey(col.key);
                          setOrder(!order);
                        }}>
                        <div className="flex items-center cursor-pointer w-fit">
                          {col.name}
                          {order && sortKey === col.key ? (
                            <ChevronDown className="w-4 h-4 ml-1" />
                          ) : (
                            <ChevronUp className="w-4 h-4 ml-1" />
                          )}
                        </div>
                      </TableHead>
                    );
                  })}
                {!loading && <TableHead className="w-full flex items-center ">Actions</TableHead>}
              </TableRow>
            </TableHeader>
            {bankAccounts.length === 0 ? (
              <EmptyTable
                message="Aucune Compte Bancaire trouvée"
                visibleColumns={visibleColumns}
              />
            ) : (
              <TableBody>{dataBlock}</TableBody>
            )}
          </Table>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center w-full">
            <Label className="font-semibold text-sm mx-2">Afficher :</Label>
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
          <PaginationControls
            className="justify-end"
            hasNextPage={bankAccountsResp?.meta.hasNextPage}
            hasPreviousPage={bankAccountsResp?.meta.hasPreviousPage}
            page={page}
            pageCount={bankAccountsResp?.meta.pageCount || 1}
            fetchCallback={(page: number) => setPage(page)}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

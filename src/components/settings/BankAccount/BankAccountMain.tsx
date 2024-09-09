import React from 'react';
import { useMutation, useQuery } from '@tanstack/react-query';
import { BankAccount, CreateBankAccountDto, UpdateBankAccountDto, api } from '@/api';
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
  Trash2,
  SquarePlus,
  Grid2x2Check,
  ArrowUp
} from 'lucide-react';
import { EmptyTable, PaginationControls } from '@/components/common';
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
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { useBankAccountManager } from './hooks/useBankAccountManager';
import { BankAccountCreateDialog } from './dialogs/BankAccountCreateDialog';
import { BankAccountUpdateDialog } from './dialogs/BankAccountUpdateDialog';
import { BankAccountDeleteDialog } from './dialogs/BankAccountDeleteDialog';
import { BANK_ACCOUNT_COLUMNS } from './constants/bank-account.constants';
import { BankAccountPromoteDialog } from './dialogs/BankAccountPromoteDialog';

interface BankAccountMainProps {
  className?: string;
}

export const BankAccountMain: React.FC<BankAccountMainProps> = ({ className }) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');

  const bankAccountManager = useBankAccountManager();

  const columns = React.useMemo(() => {
    return BANK_ACCOUNT_COLUMNS;
  }, []);

  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);

  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);

  const [order, setOrder] = React.useState(true);
  const { value: debouncedOrder, loading: ordering } = useDebounce<boolean>(order, 500);

  const [sortKey, setSortKey] = React.useState('id');
  const { value: debouncedSortKey, loading: sorting } = useDebounce<string>(sortKey, 500);

  const [searchKey, setSearchKey] = React.useState('name');
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
  const [promoteDialog, setPromoteDialog] = React.useState(false);

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
      debouncedSearchKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.bankAccount.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedOrder ? 'ASC' : 'DESC',
        debouncedSortKey,
        debouncedSearchKey,
        debouncedSearchTerm
      )
  });

  const bankAccounts = React.useMemo(() => {
    if (!bankAccountsResp) return [];
    return bankAccountsResp.data;
  }, [bankAccountsResp]);

  // determine if there are bank accounts available so we let the client decide to switch its main account
  const [hasToCreateMainByDefault, setHasToCreateMainByDefault] = React.useState<boolean>(false);
  const [hasToUpdateMainByDefault, setHasToUpdateMainByDefault] = React.useState<boolean>(false);
  React.useEffect(() => {
    const fetchInitialAccounts = async () => {
      const resp = await api.bankAccount.findPaginated();
      setHasToCreateMainByDefault(resp.data.length === 0);
      setHasToUpdateMainByDefault(resp.data.length === 1);
    };
    fetchInitialAccounts();
  }, [bankAccounts]);

  //create bank account
  const { mutate: createBankAccount, isPending: isCreatePending } = useMutation({
    mutationFn: (data: CreateBankAccountDto) => api.bankAccount.create(data),
    onSuccess: () => {
      toast.success('Compte Bancaire ajouté avec succès');
      refetchBankAccounts();
      bankAccountManager.reset();
      setCreateDialog(false);
    },
    onError: (error) => {
      const message = getErrorMessage('', error, 'Erreur lors de la création du compte bancaire');
      toast.error(message);
    }
  });

  //update bank account
  const { mutate: updateBankAccount, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: UpdateBankAccountDto) => api.bankAccount.update(data),
    onSuccess: () => {
      bankAccountManager.setBankAccount(api.bankAccount.factory());
      toast.success('Compte Bancaire modifié avec succès');
      refetchBankAccounts();
      bankAccountManager.reset();
      setUpdateDialog(false);
    },
    onError: (error) => {
      const message = getErrorMessage(
        '',
        error,
        'Erreur lors de la modification du compte bancaire'
      );
      toast.error(message);
    }
  });

  //remove bank account
  const { mutate: removeBankAccount, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.bankAccount.remove(id),
    onSuccess: () => {
      if (bankAccounts?.length == 1 && page > 1) setPage(page - 1);
      toast.success('Compte Bancaire supprimée avec succès');
      refetchBankAccounts();
      setDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, 'Erreur lors de la suppression du compte bancaire'));
    }
  });

  //promote bank account
  const { mutate: promoteBankAccount, isPending: isPromotionPending } = useMutation({
    mutationFn: (data: BankAccount) => api.bankAccount.update({ ...data, isMain: true }),
    onSuccess: (data) => {
      toast.success(`Compte Bancaire '${data.name}' promu avec succès`);
      refetchBankAccounts();
      bankAccountManager.reset();
      setPromoteDialog(false);
    },
    onError: (error) => {
      const message = getErrorMessage('', error, 'Erreur lors de la promotion du compte bancaire');
      toast.error(message);
    }
  });

  const handleBankAccountCreateSubmit = () => {
    if (hasToCreateMainByDefault) bankAccountManager.set('isMain', true);
    const bankAccount = bankAccountManager.getBankAccount();
    const validation = api.bankAccount.validate(bankAccount);
    if (validation.message) {
      toast.error(validation.message);
    } else {
      createBankAccount(bankAccount);
    }
  };

  const handleBankAccountUpdateSubmit = () => {
    const bankAccount = bankAccountManager.getBankAccount();
    const validation = api.bankAccount.validate(bankAccount, hasToUpdateMainByDefault);
    if (validation.message) {
      toast.error(validation.message);
    } else {
      updateBankAccount(bankAccount);
    }
  };

  const dataBlock = React.useMemo(() => {
    return bankAccounts?.map((account: BankAccount) => (
      <TableRow key={account.id}>
        <BankAccountCells bankAccount={account} visibleColumns={visibleColumns} />
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
                  bankAccountManager.setBankAccount(account);
                  setUpdateDialog(true);
                }}>
                <Settings2 className="h-5 w-5 mr-2" /> {tCommon('commands.modify')}
              </DropdownMenuItem>
              {!account.isMain && (
                <DropdownMenuItem
                  onClick={() => {
                    bankAccountManager.setBankAccount(account);
                    setPromoteDialog(true);
                  }}>
                  <ArrowUp className="h-5 w-5 mr-2" /> Principal
                </DropdownMenuItem>
              )}
              {!account.isMain && (
                <DropdownMenuItem
                  onClick={() => {
                    bankAccountManager.setBankAccount(account);
                    setDeleteDialog(true);
                  }}>
                  <Trash2 className="h-5 w-5 mr-2" /> {tCommon('commands.delete')}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [bankAccounts, visibleColumns, tCommon]);

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
      <BankAccountCreateDialog
        open={createDialog}
        isCreatePending={isCreatePending}
        createBankAccount={handleBankAccountCreateSubmit}
        onClose={() => {
          setCreateDialog(false);
          bankAccountManager.reset();
        }}
        mainByDefault={hasToCreateMainByDefault}
      />
      <BankAccountUpdateDialog
        open={updateDialog}
        updateBankAccount={handleBankAccountUpdateSubmit}
        isUpdatePending={isUpdatePending}
        onClose={() => {
          setUpdateDialog(false);
          bankAccountManager.reset();
        }}
      />
      <BankAccountDeleteDialog
        open={deleteDialog}
        deleteBankAccount={() => {
          bankAccountManager?.id && removeBankAccount(bankAccountManager?.id);
        }}
        isDeletionPending={isDeletePending}
        label={`${bankAccountManager.name} (${bankAccountManager?.iban})`}
        onClose={() => {
          setDeleteDialog(false);
        }}
      />
      <BankAccountPromoteDialog
        open={promoteDialog}
        promoteBankAccount={() => {
          bankAccountManager?.id && promoteBankAccount(bankAccountManager.getBankAccount());
        }}
        isPromotingPending={isPromotionPending}
        label={bankAccountManager.name}
        onClose={() => {
          setPromoteDialog(false);
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
                  <Button
                    className="flex gap-2"
                    onClick={() => {
                      bankAccountManager.reset();
                      setCreateDialog(true);
                    }}>
                    {tSettings('bank_account.new')}
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
            <Table className="w-full" count={size} isPending={loading}>
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
              className="mt-5 justify-end"
              hasNextPage={bankAccountsResp?.meta.hasNextPage}
              hasPreviousPage={bankAccountsResp?.meta.hasPreviousPage}
              page={page}
              pageCount={bankAccountsResp?.meta.pageCount || 1}
              fetchCallback={(page: number) => setPage(page)}
            />
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

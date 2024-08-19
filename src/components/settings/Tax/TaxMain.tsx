import { api } from '@/api';
import { Tax } from '@/api/types/tax';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu';
import { Button } from '../../ui/button';
import {
  ChevronDown,
  ChevronUp,
  MoreHorizontal,
  Search,
  Settings2,
  Trash2,
  SquarePlus,
  Grid2x2Check
} from 'lucide-react';
import { toast } from 'react-toastify';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { isAlphabeticOrSpace, isValue } from '@/utils/validations/string.validations';
import { Label } from '../../ui/label';
import { EmptyTable } from '../../common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { PaginationControls } from '@/components/common';
import { getErrorMessage } from '@/utils/errors';
import { TaxCells } from './TaxCells';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { TAX_COLUMNS } from './constants/tax.constants';
import { useTaxManager } from './hooks/useTaxManager';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { TaxCreateDialog } from './dialogs/TaxCreateDialog';
import { TaxUpdateDialog } from './dialogs/TaxUpdateDialog';
import { TaxDeleteDialog } from './dialogs/TaxDeleteDialog';

interface TaxMainProps {
  className?: string;
}

const TaxMain: React.FC<TaxMainProps> = ({ className }) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');

  const taxManger = useTaxManager();

  const columns = React.useMemo(() => {
    return TAX_COLUMNS;
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
    data: taxesResp,
    refetch: refetchTaxes
  } = useQuery({
    queryKey: [
      'taxes',
      debouncedPage,
      debouncedSize,
      debouncedOrder,
      debouncedSortKey,
      debouncedSearchKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.tax.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedOrder ? 'ASC' : 'DESC',
        debouncedSortKey,
        debouncedSearchKey,
        debouncedSearchTerm
      )
  });

  const taxes = React.useMemo(() => {
    if (!taxesResp) return [];
    return taxesResp.data;
  }, [taxesResp]);

  const { mutate: createTax, isPending: isCreatePending } = useMutation({
    mutationFn: (data: Tax) => api.tax.create(data),
    onSuccess: () => {
      toast.success('Taxe ajoutée avec succès', { position: 'bottom-right' });
      refetchTaxes();
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, 'Erreur lors de la création du taxe'), {
        position: 'bottom-right'
      });
    }
  });

  const { mutate: updateTax, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: Tax) => api.tax.update(data),
    onSuccess: () => {
      toast.success('Taxe modifiée avec succès', { position: 'bottom-right' });
      refetchTaxes();
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, 'Erreur lors de la modification du taxe'), {
        position: 'bottom-right'
      });
    }
  });

  const { mutate: removeTax, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.tax.remove(id),
    onSuccess: () => {
      if (taxes?.length == 1 && page > 1) setPage(page - 1);
      toast.success('Taxe supprimée avec succès', { position: 'bottom-right' });
      refetchTaxes();
      setDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, 'Erreur lors de la suppression du taxe'), {
        position: 'bottom-right'
      });
    }
  });

  const handleTaxSubmit = (tax: Tax, callback: (tax: Tax) => void): boolean => {
    const validation = api.paymentCondition.validate(tax);
    if (validation.message) {
      toast.error(validation.message, { position: 'bottom-right' });
      return false;
    } else {
      callback(tax);
      return true;
    }
  };

  const dataBlock = React.useMemo(() => {
    return taxes?.map((tax: Tax) => (
      <TableRow key={tax.id} className="w-full">
        <TaxCells visibleColumns={visibleColumns} tax={tax} />
        <TableCell className="flex justify-end">
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
                  taxManger.setTax(tax);
                  setUpdateDialog(true);
                }}>
                <Settings2 className="h-5 w-5 mr-2" /> {tCommon('commands.modify')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  taxManger.setTax(tax);
                  setDeleteDialog(true);
                }}>
                <Trash2 className="h-5 w-5 mr-2" /> {tCommon('commands.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [taxes, tCommon, visibleColumns]);

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
      <TaxCreateDialog
        open={createDialog}
        isCreatePending={isCreatePending}
        createTax={() => {
          handleTaxSubmit(taxManger.getTax(), createTax) && setCreateDialog(false);
        }}
        onClose={() => {
          setCreateDialog(false);
        }}
      />
      <TaxUpdateDialog
        open={updateDialog}
        updateTax={() => {
          handleTaxSubmit(taxManger.getTax(), updateTax) && setUpdateDialog(false);
        }}
        isUpdatePending={isUpdatePending}
        onClose={() => {
          setUpdateDialog(false);
        }}
      />
      <TaxDeleteDialog
        open={deleteDialog}
        deleteTax={() => {
          taxManger?.id && removeTax(taxManger?.id);
        }}
        isDeletionPending={isDeletePending}
        label={taxManger?.label}
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
                    {tSettings('tax.new')}
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
              {taxes.length === 0 ? (
                <EmptyTable message="Aucune Taxe trouvée" visibleColumns={visibleColumns} />
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
              hasNextPage={taxesResp?.meta.hasNextPage}
              hasPreviousPage={taxesResp?.meta.hasPreviousPage}
              page={page}
              pageCount={taxesResp?.meta.pageCount || 1}
              fetchCallback={(page: number) => setPage(page)}
            />
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default TaxMain;

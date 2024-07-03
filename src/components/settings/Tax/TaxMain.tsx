import { api } from '@/api';
import { Tax } from '@/api/types/tax';
import { useMutation, useQuery } from '@tanstack/react-query';
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  TableRowShimmerBlock
} from '../../ui/table';
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
  DollarSign,
  Settings2,
  Trash2
} from 'lucide-react';
import { ChoiceDialog } from '../../dialogs/ChoiceDialog';
import { toast } from 'react-toastify';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { isAlphabeticOrSpace, isValue } from '@/utils/validations/string.validations';
import { Label } from '../../ui/label';
import { Container } from '../../common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { PaginationControls } from '@/components/common';
import { UpdateDialog } from '../../dialogs/UpdateDialog';
import { TaxForm } from './TaxForm';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/useDebounce';
import { TaxCells } from './TaxCells';

interface TaxMainProps {
  className?: string;
}

const TaxMain: React.FC<TaxMainProps> = ({ className }) => {
  const [formTax, setFormTax] = React.useState<Tax>({
    label: '',
    rate: 0,
    isSpecial: false
  } as Tax);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [updateDialog, setUpdateDialog] = React.useState(false);
  const [selectedTax, setSelectedTax] = React.useState<Tax | null>(null);
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
    data: taxesResp,
    refetch: refetchTaxes
  } = useQuery({
    queryKey: [
      'taxes',
      debouncedPage,
      debouncedSize,
      debouncedOrder,
      debouncedSortKey,
      debouncedSearch
    ],
    queryFn: () =>
      api.tax.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedOrder ? 'ASC' : 'DESC',
        debouncedSortKey,
        debouncedSearch
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
      toast.error(getErrorMessage(error, 'Erreur lors de la création du taxe'), {
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
      toast.error(getErrorMessage(error, 'Erreur lors de la modification du taxe'), {
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
      setSelectedTax(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Erreur lors de la suppression du taxe'), {
        position: 'bottom-right'
      });
    }
  });

  const validateForm = (tax: Tax | null) => {
    if (!tax?.label || tax?.label.length < 3 || !isAlphabeticOrSpace(tax?.label)) {
      return 'Veuillez entrer un titre valide';
    } else if (
      !tax ||
      !isValue(tax?.rate?.toString() || '') ||
      (tax?.rate || 0) <= 0 ||
      (tax?.rate || 0) > 1
    ) {
      return 'Veuillez entrer un taux valide';
    }
    return '';
  };

  const handleTaxForm = async (tax: Tax | null, callback: (tax: Tax) => void) => {
    const message = validateForm(tax);
    if (message) toast.error(message, { position: 'bottom-right' });
    else tax && callback(tax);
  };

  const dataBlock = React.useMemo(() => {
    return taxes?.map((tax: Tax) => (
      <TableRow key={tax.id}>
        <TaxCells tax={tax} />
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
                  setSelectedTax(tax);
                  setUpdateDialog(true);
                }}>
                <Settings2 className="h-5 w-5 mr-2" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTax(tax);
                  setDeleteDialog(true);
                }}>
                <Trash2 className="h-5 w-5 mr-2" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [taxes]);

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
        label="Suppression du Tax"
        description={
          <>
            Voulez-vous vraiment supprimer le taxe avec l&apos;étiquette{' '}
            <span className="font-semibold">{selectedTax?.label}</span>
          </>
        }
        onClose={() => setDeleteDialog(false)}
        positiveCallback={() => {
          selectedTax && removeTax(selectedTax?.id || -1);
        }}
      />
      <UpdateDialog
        open={updateDialog}
        form={<TaxForm tax={selectedTax} onTaxChange={(tax: Tax) => setSelectedTax(tax)} />}
        label="Modification du taxe"
        onClose={() => setUpdateDialog(false)}
        positiveCallback={() => {
          handleTaxForm(selectedTax, updateTax);
        }}
      />
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle>
              {' '}
              <div className="flex items-center">
                <DollarSign className="h-6 w-6 mr-2" />
                Nouveau Taxe
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TaxForm tax={formTax} onTaxChange={(tax: Tax) => setFormTax(tax)} />
          </CardContent>
          <CardFooter className="border-t px-6 py-4 block">
            <Button
              onClick={() => {
                handleTaxForm(formTax, createTax);
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
          </div>

          <Table>
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow>
                <TableHead className="w-4/12">
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
                <TableHead className="w-3/12">
                  <div
                    className="flex items-center cursor-pointer w-fit"
                    onClick={() => {
                      setSortKey('rate');
                      setOrder(!order);
                    }}>
                    Taux
                    {order && sortKey == 'rate' ? (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-3/12">
                  <div
                    className="flex items-center cursor-pointer w-fit"
                    onClick={() => {
                      setSortKey('isSpecial');
                      setOrder(!order);
                    }}>
                    Taxe Spéciale
                    {order && sortKey == 'isSpecial' ? (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-1/12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {loading ? (
              <TableBody className="mt-2">
                {/* TableShimmer */}
                <TableRowShimmerBlock className="w-full h-16" count={2} isPending={loading} />
              </TableBody>
            ) : !taxes?.length ? (
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-center" colSpan={4}>
                    Aucune taxe trouvée
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>{dataBlock}</TableBody>
            )}
          </Table>
          <PaginationControls
            className="mt-5 justify-end"
            hasNextPage={taxesResp?.meta.hasNextPage}
            hasPreviousPage={taxesResp?.meta.hasPreviousPage}
            page={page}
            pageCount={taxesResp?.meta.pageCount || 1}
            fetchCallback={(page: number) => setPage(page)}
          />
        </Container>
      </div>
    </>
  );
};

export default TaxMain;

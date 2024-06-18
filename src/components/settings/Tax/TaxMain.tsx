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
import { ChevronDown, ChevronUp, MoreHorizontal, Search, DollarSign } from 'lucide-react';
import { ChoiceDialog } from '../../dialogs/ChoiceDialog';
import { toast } from 'react-toastify';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { isAlphabeticOrSpace, isValue } from '@/utils/validations/string.validations';
import { Label } from '../../ui/label';
import { Container } from '../../common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Spinner } from '../../common/Spinner';
import { PaginationControls } from '../../common/PaginationControls';
import { Badge } from '../../ui/badge';
import { UpdateDialog } from '../../dialogs/UpdateDialog';
import { TaxForm } from './TaxForm';

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
  const [size, setSize] = React.useState(5);
  const [order, setOrder] = React.useState(true);

  const {
    isPending: isFetchPending,
    error,
    data: taxesResp,
    refetch: refetchTaxes
  } = useQuery({
    queryKey: ['taxes', page, size, order],
    queryFn: () => api.tax.find(page, size, order ? 'ASC' : 'DESC')
  });

  const taxes = React.useMemo(() => {
    if (!taxesResp) return [];
    return taxesResp.data;
  }, [taxesResp]);

  const { mutate: createTax, isPending: isCreatePending } = useMutation({
    mutationFn: (data: any) => api.tax.create(data),
    onSuccess: () => {
      toast.success('Taxe ajoutée avec succès', { position: 'bottom-right' });
      refetchTaxes();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la création du taxe', {
        position: 'bottom-right'
      });
    }
  });

  const { mutate: updateTax, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: any) => api.tax.update(data),
    onSuccess: () => {
      toast.success('Taxe modifiée avec succès', { position: 'bottom-right' });
      refetchTaxes();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la modification du taxe', {
        position: 'bottom-right'
      });
    }
  });

  const { mutate: removeTax, isPending: isDeletePending } = useMutation({
    mutationFn: (id: any) => api.tax.remove(id),
    onSuccess: () => {
      if (taxes?.length == 1 && page > 1) setPage(page - 1);
      toast.success('Taxe supprimée avec succès', { position: 'bottom-right' });
      setTimeout(refetchTaxes, 100);
      setSelectedTax(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || 'Erreur lors de la suppression du taxe', {
        position: 'bottom-right'
      });
    }
  });

  const validateForm = (tax: Tax | null) => {
    if (!tax || tax?.label.length < 3 || !isAlphabeticOrSpace(tax?.label)) {
      return 'Veuillez entrer un titre valide';
    } else if (!tax || !isValue(tax?.rate.toString()) || tax?.rate <= 0 || tax?.rate > 1) {
      return 'Veuillez entrer un taux valide';
    }
    return '';
  };

  const handleTaxForm = async (tax: Tax | null, callback: Function) => {
    const message = validateForm(tax);
    if (message) toast.error(message, { position: 'bottom-right' });
    else callback(tax);
  };

  const dataBlock = React.useMemo(() => {
    return taxes?.map((tax: Tax) => (
      <TableRow key={tax.id}>
        <TableCell className="font-medium">{tax.label}</TableCell>
        <TableCell className="font-medium">{(tax.rate * 100).toFixed(2)}%</TableCell>
        <TableCell className="font-medium">
          <Badge className="px-4 py-1">{tax.isSpecial ? 'Oui' : 'Non'}</Badge>
        </TableCell>
        <TableCell>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTax(tax);
                  setUpdateDialog(true);
                }}>
                Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedTax(tax);
                  setDeleteDialog(true);
                }}>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [taxes]);

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
          removeTax(selectedTax?.id);
        }}
      />
      <UpdateDialog
        open={updateDialog}
        form={<TaxForm tax={selectedTax} onChange={(tax: Tax) => setSelectedTax(tax)} />}
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
            <TaxForm tax={formTax} onChange={(tax: Tax) => setFormTax(tax)} />
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
                placeholder="Search..."
                className="w-96 rounded-lg bg-background pl-8"
              />
            </div>

            <div className="w-full flex items-center justify-end">
              <Label className="font-semibold text-md mx-2">Taille :</Label>
              <Select onValueChange={(value) => setSize(+value)}>
                <SelectTrigger className="w-1/6">
                  <SelectValue placeholder={size} />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="5">5</SelectItem>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="15">15</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-4/12">
                  <div
                    className="flex items-center cursor-pointer w-fit"
                    onClick={() => setOrder(!order)}>
                    Titre
                    {order ? (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-3/12">
                  <div
                    className="flex items-center cursor-pointer w-fit"
                    onClick={() => setOrder(!order)}>
                    Taux
                    {order ? (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-3/12">
                  <div
                    className="flex items-center cursor-pointer w-fit"
                    onClick={() => setOrder(!order)}>
                    Taxe Spéciale
                    {order ? (
                      <ChevronDown className="w-4 h-4 ml-1" />
                    ) : (
                      <ChevronUp className="w-4 h-4 ml-1" />
                    )}
                  </div>
                </TableHead>
                <TableHead className="w-2/12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {isFetchPending || isCreatePending || isUpdatePending || isDeletePending ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Spinner className="m-5" />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : !taxes?.length ? (
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-center" colSpan={2}>
                    Aucune activité trouvée
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : (
              <TableBody>{dataBlock}</TableBody>
            )}
          </Table>
          <PaginationControls
            className="justify-end"
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

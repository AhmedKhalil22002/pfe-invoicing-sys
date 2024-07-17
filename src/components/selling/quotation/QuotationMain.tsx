import { Quotation, api, QUOTATION_COLUMNS, QUOTATION_STATUS } from '@/api';
import { BreadcrumbCommon, EmptyTable, PaginationControls } from '@/components/common';
import { ChoiceDialog } from '@/components/dialogs/ChoiceDialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
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
import { cn } from '@/lib/utils';
import { getErrorMessage } from '@/utils/errors';
import { useMutation, useQuery } from '@tanstack/react-query';
import {
  ChevronDown,
  ChevronUp,
  FolderInput,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Telescope,
  Trash2,
  Copy,
  Send,
  HeartCrack,
  Info
} from 'lucide-react';
import { useRouter } from 'next/router';
import React from 'react';
import { toast } from 'react-toastify';
import { QuotationCells } from './QuotationCells';
import { useDebounce } from '@/hooks/other/useDebounce';

interface QuotationMainProps {
  className?: string;
  firmId?: number;
  interlocutorId?: number;
}

export const QuotationMain: React.FC<QuotationMainProps> = ({
  className,
  firmId,
  interlocutorId
}) => {
  const router = useRouter();
  const [page, setPage] = React.useState(1);
  const { value: debouncedPage, loading: paging } = useDebounce<number>(page, 500);
  const [size, setSize] = React.useState(5);
  const { value: debouncedSize, loading: resizing } = useDebounce<number>(size, 500);
  const [order, setOrder] = React.useState(true);
  const { value: debouncedOrder, loading: ordering } = useDebounce<boolean>(order, 500);
  const [search, setSearch] = React.useState('');
  const { value: debouncedSearch, loading: searching } = useDebounce<string>(search, 500);
  const [sortKey, setSortKey] = React.useState('[createdAt]');
  const { value: debouncedSortKey, loading: sorting } = useDebounce<string>(sortKey, 500);
  const [visibleColumns, setVisibleColumns] = React.useState(
    QUOTATION_COLUMNS.map((col) => {
      return { [col.key]: col.default ? true : false };
    }).reduce((acc, current) => {
      const key = Object.keys(current)[0];
      acc[key] = current[key];
      return acc;
    }, {})
  );
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [selectedQuotation, setSelectedQuotation] = React.useState<Quotation | null>(null);

  const {
    isPending: isFetchPending,
    error,
    data: quotationsResp,
    refetch: refetchQuotations
  } = useQuery({
    queryKey: [
      'quotations',
      debouncedPage,
      debouncedSize,
      debouncedOrder,
      debouncedSortKey,
      debouncedSearch,
      firmId,
      interlocutorId
    ],
    queryFn: () =>
      api.quotation.find(
        debouncedPage,
        debouncedSize,
        debouncedOrder ? 'ASC' : 'DESC',
        debouncedSortKey,
        debouncedSearch,
        false,
        firmId,
        interlocutorId
      )
  });

  const quotations = React.useMemo(() => {
    if (!quotationsResp) return [];
    return quotationsResp.data;
  }, [quotationsResp]);

  const { mutate: removeQuotation, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.quotation.remove(id),
    onSuccess: () => {
      if (quotations?.length == 1 && page > 1) setPage(page - 1);
      toast.success('Devis supprimée avec succès', { position: 'bottom-right' });
      refetchQuotations();
      setSelectedQuotation(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Erreur lors de la suppression du devis'), {
        position: 'bottom-right'
      });
    }
  });

  const dataBlock = React.useMemo(() => {
    return quotations?.map((quotation: Quotation) => (
      <TableRow key={quotation.id}>
        <QuotationCells visibleColumns={visibleColumns} quotation={quotation} />
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
                onClick={() => router.push('/selling/quotation?id=' + quotation.id)}>
                <Telescope className="h-5 w-5 mr-2" /> Inspecter
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Copy className="h-5 w-5 mr-2" /> Dupliquer
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Send className="h-5 w-5 mr-2" /> Envoyer
              </DropdownMenuItem>
              {quotation.status == QUOTATION_STATUS.Draft && (
                <DropdownMenuItem
                  onClick={() => router.push('/selling/quotation?id=' + quotation.id)}>
                  <Settings2 className="h-5 w-5 mr-2" /> Modifier
                </DropdownMenuItem>
              )}
              {quotation.status == QUOTATION_STATUS.Draft && (
                <DropdownMenuItem
                  onClick={() => {
                    setSelectedQuotation(quotation);
                    setDeleteDialog(true);
                  }}>
                  <Trash2 className="h-5 w-5 mr-2" /> Supprimer
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [quotations, visibleColumns]);

  const loading =
    isFetchPending || isDeletePending || paging || resizing || ordering || searching || sorting;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className={cn('overflow-auto p-8', className)}>
      {!firmId && !interlocutorId && (
        <BreadcrumbCommon hierarchy={[{ title: 'Vente', href: '/selling' }, { title: 'Devis' }]} />
      )}
      <ChoiceDialog
        open={deleteDialog}
        label="Suppression du devis"
        description={
          <>
            <span>Voulez-vous vraiment supprimer le devis N°</span>
            <span className="font-semibold">{selectedQuotation?.id}</span>
          </>
        }
        onClose={() => setDeleteDialog(false)}
        positiveCallback={() => {
          selectedQuotation && removeQuotation(selectedQuotation?.id || -1);
        }}
      />
      <Card className="w-full">
        <CardContent className="p-5">
          <Button className="mx-2" onClick={() => router.push('/selling/new-quotation')}>
            Nouveau Devis
            <Plus className="h-4 w-4 ml-2" />
          </Button>
          <Button className="mx-2">
            Import
            <FolderInput className="h-4 w-4 ml-2" />
          </Button>
        </CardContent>
      </Card>
      <Card className="w-full mt-5">
        <CardHeader>
          <CardTitle>
            <div className="flex items-center gap-4">
              <div className="relative flex-1 md:grow-0 text-start">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  className="w-96 rounded-lg bg-background pl-8"
                  onChange={(e) => {
                    setSearch(e.target.value.trim());
                  }}
                />
              </div>
              <div className="flex items-center gap-2 w-full">
                <Label>Recherché par :</Label>
                <Select
                  onValueChange={(value) => {
                    setSortKey(value);
                  }}
                  value={sortKey}>
                  <SelectTrigger className="w-1/2 mx-2 ">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {QUOTATION_COLUMNS.map((col) => {
                      if (col.canBeSearched && visibleColumns[col.key] == true)
                        return (
                          <SelectItem key={col.key} value={col.key}>
                            {col.name}
                          </SelectItem>
                        );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full flex items-center justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="mx-5">
                      Affichage des colonnes
                      <ChevronDown className="h-5 w-5 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="mt-1 mr-5 w-fit">
                    <div className="grid gap-1">
                      {QUOTATION_COLUMNS.map((col) => {
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
                  QUOTATION_COLUMNS.map((col) => {
                    return (
                      <TableHead
                        hidden={visibleColumns[col.key] === false}
                        key={col.key}
                        onClick={() => {
                          setSortKey(col.key);
                          setOrder(!order);
                        }}>
                        <div className="flex items-center text-center cursor-pointer w-fit">
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
            {quotations.length === 0 ? (
              <EmptyTable message="Aucune Devis trouvée" visibleColumns={visibleColumns} />
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
            hasNextPage={quotationsResp?.meta.hasNextPage}
            hasPreviousPage={quotationsResp?.meta.hasPreviousPage}
            page={page}
            pageCount={quotationsResp?.meta.pageCount || 1}
            fetchCallback={(page: number) => setPage(page)}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

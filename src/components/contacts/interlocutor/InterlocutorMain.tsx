import React from 'react';
import { cn } from '@/lib/utils';
import { api, Interlocutor, INTERLOCUTOR_COLUMNS } from '@/api';
import { useMutation, useQuery } from '@tanstack/react-query';
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
  Grid2x2Check,
  MoreHorizontal,
  Plus,
  Search,
  Settings2,
  Telescope,
  Trash2
} from 'lucide-react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Input } from '../../ui/input';
import { Popover, PopoverContent, PopoverTrigger } from '../../ui/popover';
import { Checkbox } from '../../ui/checkbox';
import { EmptyTable, PaginationControls } from '../../common';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { Label } from '../../ui/label';
import { useRouter } from 'next/router';
import { ChoiceDialog } from '../../dialogs/ChoiceDialog';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/errors';
import { BreadcrumbCommon } from '@/components/common/Breadcrumb';
import { useDebounce } from '@/hooks/other/useDebounce';
import { InterlocutorCells } from './InterlocutorCells';
import { useTranslation } from 'react-i18next';
interface InterlocutorProps {
  className?: string;
  firmId?: number;
  specificDetails?: boolean;
  mainInterlocutorId?: number;
}

export const InterlocutorMain: React.FC<InterlocutorProps> = ({
  className,
  firmId,
  specificDetails = false,
  mainInterlocutorId
}) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');

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
    INTERLOCUTOR_COLUMNS.map((col) => {
      return { [col.key]: col.default ? true : false };
    }).reduce((acc, current) => {
      const key = Object.keys(current)[0];
      acc[key] = current[key];
      return acc;
    }, {})
  );
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [selectedInterlocutor, setSelectedInterlocutor] = React.useState<Interlocutor | null>(null);

  const {
    isPending: isFetchPending,
    error,
    data: interlocutorsResp,
    refetch: refetchInterloctors
  } = useQuery({
    queryKey: [
      'interlocutors',
      debouncedPage,
      debouncedSize,
      debouncedOrder,
      debouncedSortKey,
      debouncedSearch,
      firmId
    ],
    queryFn: () =>
      api.interlocutor.find(
        debouncedPage,
        debouncedSize,
        debouncedOrder ? 'ASC' : 'DESC',
        debouncedSortKey,
        debouncedSearch,
        false,
        firmId
      )
  });

  const interlocutors = React.useMemo(() => {
    if (!interlocutorsResp) return [];
    return interlocutorsResp.data;
  }, [interlocutorsResp]);

  const { mutate: removeInterlocutor, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.interlocutor.remove(id),
    onSuccess: () => {
      if (interlocutors?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tContacts('interlocutor.action_remove_success'), { position: 'bottom-right' });
      refetchInterloctors();
      setSelectedInterlocutor(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, tContacts('interlocutor.action_remove_failure')), {
        position: 'bottom-right'
      });
    }
  });

  const dataBlock = React.useMemo(() => {
    return interlocutors?.map((interlocutor: Interlocutor) => (
      <TableRow key={interlocutor.id}>
        <InterlocutorCells
          visibleColumns={visibleColumns}
          interlocutor={interlocutor}
          isMain={interlocutor.id == mainInterlocutorId}
          specificDetails={specificDetails}
        />
        <TableCell className="flex">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button aria-haspopup="true" size="icon" variant="ghost">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center">
              <DropdownMenuLabel>{tCommon('commands.actions')}</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => router.push('/contacts/interlocutor?id=' + interlocutor.id)}>
                <Telescope className="h-5 w-5 mr-2" /> {tCommon('commands.inspect')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => router.push('/contacts/modify-interlocutor?id=' + interlocutor.id)}>
                <Settings2 className="h-5 w-5 mr-2" /> {tCommon('commands.modify')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedInterlocutor(interlocutor);
                  setDeleteDialog(true);
                }}>
                <Trash2 className="h-5 w-5 mr-2" /> {tCommon('commands.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [interlocutors, visibleColumns, tCommon]);

  const loading =
    isFetchPending || isDeletePending || paging || resizing || ordering || searching || sorting;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className={cn('overflow-auto', className)}>
      {!firmId && (
        <BreadcrumbCommon
          hierarchy={[
            { title: tCommon('menu.contacts'), href: '/contacts' },
            { title: tContacts('interlocutor.plural') }
          ]}
        />
      )}
      <ChoiceDialog
        open={deleteDialog}
        label={tContacts('interlocutor.delete_label')}
        description={
          <>
            {tContacts('interlocutor.delete_prompt')}{' '}
            <span className="font-semibold">{selectedInterlocutor?.name}</span>
          </>
        }
        onClose={() => setDeleteDialog(false)}
        positiveCallback={() => {
          selectedInterlocutor && removeInterlocutor(selectedInterlocutor?.id || -1);
        }}
      />

      <Card className="w-full">
        <CardContent className="p-5">
          <Button
            className="mx-2"
            onClick={() =>
              router.push('/contacts/new-interlocutor' + (firmId ? '?id=' + firmId : ''))
            }>
            {tContacts('interlocutor.new')}
            <Plus className="h-4 w-4 ml-2" />
          </Button>
          {/* <Button className="mx-2">
            Import
            <FolderInput className="h-4 w-4 ml-2" />
          </Button> */}
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
                <Label>{tCommon('commands.search_by')}</Label>
                <Select
                  onValueChange={(value) => {
                    setSortKey(value);
                  }}
                  value={sortKey}>
                  <SelectTrigger className="w-1/2 mx-2 ">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {INTERLOCUTOR_COLUMNS.map((col) => {
                      if (
                        col.canBeSearch &&
                        (col.alwaysVisible || firmId) &&
                        visibleColumns[col.key] == true
                      )
                        return (
                          <SelectItem key={col.key} value={col.key}>
                            {tContacts(col.code)}
                          </SelectItem>
                        );
                    })}
                  </SelectContent>
                </Select>
              </div>
              <div className="w-full flex items-center justify-end">
                <Popover>
                  <PopoverTrigger asChild>
                    <Button className="flex mx-4">
                      {tCommon('commands.display')}
                      <Grid2x2Check className="h-5 w-5 ml-2" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="mt-1 mr-5 w-fit">
                    <div className="grid gap-1">
                      {INTERLOCUTOR_COLUMNS.map((col) => {
                        if (col.alwaysVisible || firmId)
                          return (
                            <div key={col.key} className="flex gap-2 items-center">
                              <Checkbox
                                value={col.key}
                                checked={visibleColumns[col.key]}
                                onCheckedChange={(e) => {
                                  setVisibleColumns({ ...visibleColumns, [col.key]: e === true });
                                }}
                              />
                              <span className="text-sm font-medium"> {tContacts(col.code)}</span>
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
                  INTERLOCUTOR_COLUMNS.map((col) => {
                    if (col.alwaysVisible || firmId)
                      return (
                        <TableHead
                          hidden={visibleColumns[col.key] === false}
                          key={col.key}
                          onClick={() => {
                            if (col.alwaysVisible) {
                              setSortKey(col.key);
                              setOrder(!order);
                            }
                          }}>
                          <div
                            className={cn(
                              'flex items-center w-fit',
                              col.alwaysVisible ? 'cursor-pointer ' : ''
                            )}>
                            {tContacts(col.code)}
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
                  <TableHead className="w-full flex items-center ">
                    {tCommon('commands.actions')}
                  </TableHead>
                )}
              </TableRow>
            </TableHeader>
            {interlocutors.length === 0 ? (
              <EmptyTable message="Aucune Interlocuteurs trouvée" visibleColumns={visibleColumns} />
            ) : (
              <TableBody>{dataBlock}</TableBody>
            )}
          </Table>
        </CardContent>
        <CardFooter className="border-t px-6 py-4">
          <div className="flex items-center w-full">
            <Label className="font-semibold text-sm mx-2"> {tCommon('commands.display')} :</Label>
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
            hasNextPage={interlocutorsResp?.meta.hasNextPage}
            hasPreviousPage={interlocutorsResp?.meta.hasPreviousPage}
            page={page}
            pageCount={interlocutorsResp?.meta.pageCount || 1}
            fetchCallback={(page: number) => setPage(page)}
          />
        </CardFooter>
      </Card>
    </div>
  );
};

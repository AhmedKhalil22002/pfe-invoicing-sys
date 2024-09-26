import React from 'react';
import { cn } from '@/lib/utils';
import { api } from '@/api';
import { Interlocutor } from '@/types';
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
import { MoreHorizontal, Settings2, Telescope, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/errors';
import { BreadcrumbCommon } from '@/components/common/Breadcrumb';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';

import { InterlocutorDeleteDialog } from './dialogs/InterlocutorDeleteDialog';
import { InterlocutorActionsContext } from './data-table/ActionsContext';
import { DataTable } from './data-table/data-table';
import { getInterlocutorColumns } from './data-table/columns';
import { useInterlocutorManager } from './hooks/useInterlocutorManager';
interface InterlocutorProps {
  className?: string;
  firmId?: number;
  mainInterlocutorId?: number;
}

export const InterlocutorMain: React.FC<InterlocutorProps> = ({
  className,
  firmId,
  mainInterlocutorId
}) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');

  // //Remove Columns according to context when this component is called
  // const columns = React.useMemo(() => {
  //   return !firmId
  //     ? INTERLOCUTOR_COLUMNS.filter((col) => col?.key != 'isMainInOneFirm')
  //     : INTERLOCUTOR_COLUMNS;
  // }, [firmId]);

  const interlocutorManager = useInterlocutorManager();

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
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm,
      firmId
    ],
    queryFn: () =>
      api.interlocutor.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm,
        firmId
      )
  });

  const interlocutors = React.useMemo(() => {
    return interlocutorsResp?.data || [];
  }, [interlocutorsResp]);

  const context = {
    //dialogs
    openDeleteDialog: () => setDeleteDialog(true),
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: interlocutorsResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey })
  };

  const { mutate: removeInterlocutor, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.interlocutor.remove(id),
    onSuccess: () => {
      if (interlocutors?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tContacts('interlocutor.action_remove_success'));
      refetchInterloctors();
      setSelectedInterlocutor(null);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('contacts', error, tContacts('interlocutor.action_remove_failure'))
      );
    }
  });

  const isPending = isFetchPending || isDeletePending || paging || resizing || searching || sorting;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <>
      <InterlocutorDeleteDialog
        open={deleteDialog}
        deleteInterlocutor={() => {
          removeInterlocutor(interlocutorManager?.id);
          setDeleteDialog(false);
        }}
        isDeletionPending={isDeletePending}
        label={`${interlocutorManager?.name} ${interlocutorManager?.surname}`}
        onClose={() => {
          setDeleteDialog(false);
        }}
      />
      {!firmId && (
        <BreadcrumbCommon
          hierarchy={[
            { title: tCommon('menu.contacts'), href: '/contacts' },
            { title: tContacts('interlocutor.plural') }
          ]}
        />
      )}
      <InterlocutorActionsContext.Provider value={context}>
        <Card className={className}>
          <CardHeader>
            <CardTitle>{tContacts('interlocutor.singular')}</CardTitle>
            <CardDescription>{tContacts('interlocutor.card_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              className="my-5"
              data={interlocutors}
              columns={getInterlocutorColumns(
                tContacts,
                tCommon,
                mainInterlocutorId ? { mainInterlocutorId } : undefined
              )}
              isPending={isPending}
            />
          </CardContent>
        </Card>
      </InterlocutorActionsContext.Provider>
    </>
  );
};

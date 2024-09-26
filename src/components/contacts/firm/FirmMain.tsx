import { api } from '@/api';
import { Firm } from '@/types';
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
import { MoreHorizontal, Settings2, Telescope, Trash2 } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/errors';
import { BreadcrumbCommon } from '@/components/common/Breadcrumb';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useTranslation } from 'react-i18next';
import { FirmDeleteDialog } from './dialogs/FirmDeleteDialog';
import { useFirmManager } from '@/hooks/functions/useFirmManager';
import { DataTable } from './data-table/data-table';
import { FirmActionsContext } from './data-table/ActionsContext';
import { getFirmColumns } from './data-table/columns';

interface FirmMainProps {
  className?: string;
}

export const FirmMain: React.FC<FirmMainProps> = ({ className }) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');
  const { t: tCurrency } = useTranslation('currency');

  const firmManager = useFirmManager();

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

  const {
    isPending: isFetchPending,
    error,
    data: firmsResp,
    refetch: refetchFirms
  } = useQuery({
    queryKey: [
      'firms',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.firm.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        debouncedSearchTerm
      )
  });

  const firms = React.useMemo(() => {
    return firmsResp?.data || [];
  }, [firmsResp]);

  const context = {
    //dialogs
    openDeleteDialog: () => setDeleteDialog(true),
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: firmsResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey })
  };

  const { mutate: removeFirm, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.firm.remove(id),
    onSuccess: () => {
      if (firms?.length == 1 && page > 1) setPage(page - 1);
      toast.success(tContacts('firm.action_remove_success'));
      refetchFirms();
      firmManager.reset();
    },
    onError: (error) => {
      toast.error(getErrorMessage('contacts', error, tContacts('firm.action_remove_failure')));
    }
  });

  const isPending = isFetchPending || isDeletePending || paging || resizing || searching || sorting;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <>
      <FirmDeleteDialog
        open={deleteDialog}
        deleteFirm={() => {
          removeFirm(firmManager.id);
          setDeleteDialog(false);
        }}
        isDeletionPending={isDeletePending}
        label={firmManager?.name}
        onClose={() => {
          setDeleteDialog(false);
        }}
      />
      <BreadcrumbCommon
        hierarchy={[
          { title: tCommon('menu.contacts'), href: '/contacts' },
          { title: tCommon('submenu.firms') }
        ]}
      />
      <FirmActionsContext.Provider value={context}>
        <Card className={className}>
          <CardHeader>
            <CardTitle>{tContacts('firm.singular')}</CardTitle>
            <CardDescription>{tContacts('firm.card_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              className="my-5"
              data={firms}
              columns={getFirmColumns(tContacts, tCurrency, router)}
              isPending={isPending}
            />
          </CardContent>
        </Card>
      </FirmActionsContext.Provider>
    </>
  );
};

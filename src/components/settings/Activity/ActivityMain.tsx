import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { getErrorMessage } from '@/utils/errors';
import { useDebounce } from '@/hooks/other/useDebounce';
import { ActivityDeleteDialog } from './dialogs/ActivityDeleteDialog';
import { useTranslation } from 'react-i18next';
import { ActivityUpdateDialog } from './dialogs/ActivityUpdateDialog';
import { useActivityManager } from './hooks/useActivityManager';
import { ActivityCreateDialog } from './dialogs/ActivityCreateDialog';
import { Activity } from '@/types';
import { DataTable } from './data-table/data-table';
import { ActivityActionsContext } from './data-table/ActionDialogContext';
import { getActivityColumns } from './data-table/columns';

interface ActivityMainProps {
  className?: string;
}

const ActivityMain: React.FC<ActivityMainProps> = ({ className }) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');

  const activityManager = useActivityManager();

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

  const [createDialog, setCreateDialog] = React.useState(false);
  const [updateDialog, setUpdateDialog] = React.useState(false);
  const [deleteDialog, setDeleteDialog] = React.useState(false);

  const {
    isPending: isFetchPending,
    error,
    data: activitiesResp,
    refetch: refetchActivities
  } = useQuery({
    queryKey: [
      'activities',
      debouncedPage,
      debouncedSize,
      debouncedSortDetails.order,
      debouncedSortDetails.sortKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.activity.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedSortDetails.order ? 'ASC' : 'DESC',
        debouncedSortDetails.sortKey,
        'label',
        debouncedSearchTerm
      )
  });

  const activities = React.useMemo(() => {
    return activitiesResp?.data || [];
  }, [activitiesResp]);

  const context = {
    //dialogs
    openCreateDialog: () => setCreateDialog(true),
    openUpdateDialog: () => setUpdateDialog(true),
    openDeleteDialog: () => setDeleteDialog(true),
    //search, filtering, sorting & paging
    searchTerm,
    setSearchTerm,
    page,
    totalPageCount: activitiesResp?.meta.pageCount || 1,
    setPage,
    size,
    setSize,
    order: sortDetails.order,
    sortKey: sortDetails.sortKey,
    setSortDetails: (order: boolean, sortKey: string) => setSortDetails({ order, sortKey })
  };

  const { mutate: createActivity, isPending: isCreatePending } = useMutation({
    mutationFn: (data: Activity) => api.activity.create(data),
    onSuccess: () => {
      toast.success('Activité ajoutée avec succès');
      refetchActivities();
      activityManager.reset();
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, "Erreur lors de la création de l'activité"));
    }
  });

  const { mutate: updateActivity, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: Activity) => api.activity.update(data),
    onSuccess: () => {
      toast.success('Activité modifiée avec succès');
      refetchActivities();
      activityManager.reset();
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, "Erreur lors de la modification de l'activité"));
    }
  });

  const { mutate: removeActivity, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.activity.remove(id),
    onSuccess: () => {
      if (activities?.length == 1 && page > 1) setPage(page - 1);
      toast.success('Activité supprimée avec succès');
      refetchActivities();
      setDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, "Erreur lors de la suppression de l'activité"));
    }
  });

  const handleActivitySubmit = (
    activity: Activity,
    callback: (activity: Activity) => void
  ): boolean => {
    const validation = api.activity.validate(activity);
    if (validation.message) {
      toast.error(validation.message);
      return false;
    } else {
      callback(activity);
      activityManager.reset();
      return true;
    }
  };

  const isPending =
    isFetchPending ||
    isCreatePending ||
    isUpdatePending ||
    isDeletePending ||
    paging ||
    resizing ||
    searching ||
    sorting;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <>
      <ActivityCreateDialog
        open={createDialog}
        isCreatePending={isCreatePending}
        createActivity={() => {
          handleActivitySubmit(activityManager.getActivity(), createActivity) &&
            setCreateDialog(false);
        }}
        onClose={() => {
          setCreateDialog(false);
        }}
      />
      <ActivityUpdateDialog
        open={updateDialog}
        updateActivity={() => {
          handleActivitySubmit(activityManager.getActivity(), updateActivity) &&
            setUpdateDialog(false);
        }}
        isUpdatePending={isUpdatePending}
        onClose={() => {
          setUpdateDialog(false);
        }}
      />
      <ActivityDeleteDialog
        open={deleteDialog}
        deleteActivity={() => {
          activityManager?.id && removeActivity(activityManager?.id);
        }}
        isDeletionPending={isDeletePending}
        label={activityManager?.label}
        onClose={() => {
          setDeleteDialog(false);
        }}
      />
      <ActivityActionsContext.Provider value={context}>
        <Card className={className}>
          <CardHeader>
            <CardTitle>{tSettings('activity.singular')}</CardTitle>
            <CardDescription>{tSettings('activity.card_description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <DataTable
              className="my-5"
              data={activities}
              columns={getActivityColumns(tSettings)}
              isPending={isPending}
            />
          </CardContent>
        </Card>
      </ActivityActionsContext.Provider>
    </>
  );
};

export default ActivityMain;

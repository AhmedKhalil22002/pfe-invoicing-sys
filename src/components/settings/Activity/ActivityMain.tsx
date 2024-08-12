import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { EmptyTable } from '../../common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../../ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../ui/table';
import {
  ChevronDown,
  ChevronUp,
  Grid2x2Check,
  MoreHorizontal,
  Search,
  Settings2,
  SquarePlus,
  Trash2
} from 'lucide-react';
import { toast } from 'react-toastify';
import { PaginationControls } from '@/components/common';
import { useMutation, useQuery } from '@tanstack/react-query';
import { Activity, api } from '@/api';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { getErrorMessage } from '@/utils/errors';
import { ActivityCells } from './ActivityCells';
import { useDebounce } from '@/hooks/other/useDebounce';
import { ActivityDeleteDialog } from './dialogs/ActivityDeleteDialog';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';
import { useTranslation } from 'react-i18next';
import { ActivityUpdateDialog } from './dialogs/ActivityUpdateDialog';
import { useActivityManager } from './hooks/useActivityManager';
import { ActivityCreateDialog } from './dialogs/ActivityCreateDialog';
import { ACTIVITY_COLUMNS } from './constants/activity.constants';

interface ActivityMainProps {
  className?: string;
}

const ActivityMain: React.FC<ActivityMainProps> = ({ className }) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tSettings } = useTranslation('settings');

  const activityManager = useActivityManager();

  const columns = React.useMemo(() => {
    return ACTIVITY_COLUMNS;
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
    data: activitiesResp,
    refetch: refetchActivities
  } = useQuery({
    queryKey: [
      'activities',
      debouncedPage,
      debouncedSize,
      debouncedOrder,
      debouncedSortKey,
      debouncedSearchKey,
      debouncedSearchTerm
    ],
    queryFn: () =>
      api.activity.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedOrder ? 'ASC' : 'DESC',
        debouncedSortKey,
        debouncedSearchKey,
        debouncedSearchTerm
      )
  });

  const activities = React.useMemo(() => {
    if (!activitiesResp) return [];
    return activitiesResp.data;
  }, [activitiesResp]);

  const { mutate: createActivity, isPending: isCreatePending } = useMutation({
    mutationFn: (data: Activity) => api.activity.create(data),
    onSuccess: () => {
      toast.success('Activité ajoutée avec succès', { position: 'bottom-right' });
      refetchActivities();
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, "Erreur lors de la création de l'activité"), {
        position: 'bottom-right'
      });
    }
  });

  const { mutate: updateActivity, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: Activity) => api.activity.update(data),
    onSuccess: () => {
      toast.success('Activité modifiée avec succès', { position: 'bottom-right' });
      refetchActivities();
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, "Erreur lors de la modification de l'activité"), {
        position: 'bottom-right'
      });
    }
  });

  const { mutate: removeActivity, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.activity.remove(id),
    onSuccess: () => {
      if (activities?.length == 1 && page > 1) setPage(page - 1);
      toast.success('Activité supprimée avec succès', { position: 'bottom-right' });
      refetchActivities();
      setDeleteDialog(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, "Erreur lors de la suppression de l'activité"), {
        position: 'bottom-right'
      });
    }
  });

  const handleActivitySubmit = (
    activity: Activity,
    callback: (activity: Activity) => void
  ): boolean => {
    const validation = api.activity.validate(activity);
    if (validation.message) {
      toast.error(validation.message, { position: 'bottom-right' });
      return false;
    } else {
      callback(activity);
      activityManager.reset();
      return true;
    }
  };

  const dataBlock = React.useMemo(() => {
    return activities?.map((activity: Activity) => (
      <TableRow key={activity.id} className="w-full">
        <ActivityCells visibleColumns={visibleColumns} activity={activity} />
        <TableCell className="flex justify-end">
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
                onClick={() => {
                  activityManager.setActivity(activity);
                  setUpdateDialog(true);
                }}>
                <Settings2 className="h-5 w-5 mr-2" /> {tCommon('commands.modify')}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  activityManager.setActivity({ id: activity.id, label: activity.label });
                  setDeleteDialog(true);
                }}>
                <Trash2 className="h-5 w-5 mr-2" /> {tCommon('commands.delete')}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [activities, visibleColumns, tCommon]);

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
      <ActivityCreateDialog
        open={createDialog}
        isCreatePending={isCreatePending}
        CreateActivity={() => {
          handleActivitySubmit(activityManager.getActivity(), createActivity) &&
            setCreateDialog(false);
        }}
        onClose={() => {
          setCreateDialog(false);
        }}
      />
      <ActivityUpdateDialog
        open={updateDialog}
        UpdateActivity={() => {
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
      <div className={className}>
        <Card className="w-full">
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <div className="relative flex-1 md:grow-0 text-start">
                  <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    type="search"
                    className="w-96 rounded-lg bg-background pl-8"
                    onChange={(e) => {
                      setPage(1);
                      setSortKey('label');
                      setSearchTerm(e.target.value);
                    }}
                  />
                </div>
                <div className="flex items-center w-full justify-end gap-2 ">
                  <Button className="flex gap-2" onClick={() => setCreateDialog(true)}>
                    {tSettings('activity.new')}
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
            <Table shimmerClassName="w-full" count={size} isPending={loading}>
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
              {activities.length === 0 ? (
                <EmptyTable message="Aucune Activité trouvée" visibleColumns={visibleColumns} />
              ) : (
                <TableBody>{dataBlock}</TableBody>
              )}
            </Table>
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <div className="flex items-center w-full">
              <Label className="font-semibold text-sm mx-2">{tCommon('commands.display')} :</Label>
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
              hasNextPage={activitiesResp?.meta.hasNextPage}
              hasPreviousPage={activitiesResp?.meta.hasPreviousPage}
              page={page}
              pageCount={activitiesResp?.meta.pageCount || 1}
              fetchCallback={(page: number) => setPage(page)}
            />
          </CardFooter>
        </Card>
      </div>
    </>
  );
};

export default ActivityMain;

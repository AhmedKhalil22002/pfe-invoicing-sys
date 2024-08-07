import React from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../../ui/card';
import { Label } from '../../ui/label';
import { Input } from '../../ui/input';
import { Button } from '../../ui/button';
import { Container, EmptyTable } from '../../common';
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
  MoreHorizontal,
  Search,
  Settings2,
  Trash2,
  Umbrella
} from 'lucide-react';
import { toast } from 'react-toastify';
import { isAlphabeticOrSpace } from '@/utils/validations/string.validations';
import { ChoiceDialog } from '../../dialogs/ChoiceDialog';
import { PaginationControls } from '@/components/common';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { Activity } from '@/api/types/activity';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../ui/select';
import { UpdateDialog } from '../../dialogs/UpdateDialog';
import { ActivityForm } from './ActivityForm';
import { getErrorMessage } from '@/utils/errors';
import { ActivityCells } from './ActivityCells';
import { useDebounce } from '@/hooks/other/useDebounce';

interface ActivityMainProps {
  className?: string;
}

const ActivityMain: React.FC<ActivityMainProps> = ({ className }) => {
  const [formActivity, setFormActivity] = React.useState<Activity>({} as Activity);
  const [deleteDialog, setDeleteDialog] = React.useState(false);
  const [updateDialog, setUpdateDialog] = React.useState(false);
  const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);
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
    data: activitiesResp,
    refetch: refetchActivities
  } = useQuery({
    queryKey: [
      'activities',
      debouncedPage,
      debouncedSize,
      debouncedOrder,
      debouncedSortKey,
      debouncedSearch
    ],
    queryFn: () =>
      api.activity.findPaginated(
        debouncedPage,
        debouncedSize,
        debouncedOrder ? 'ASC' : 'DESC',
        debouncedSortKey,
        debouncedSearch
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
      setSelectedActivity(null);
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, "Erreur lors de la suppression de l'activité"), {
        position: 'bottom-right'
      });
    }
  });

  const validateForm = (activity: Activity | null) => {
    if (activity?.label && activity.label.length > 3 && isAlphabeticOrSpace(activity?.label)) {
      return '';
    }
    return 'Veuillez entrer un titre valide';
  };

  const handleActivityForm = async (
    activity: Activity | null,
    callback: (activity: Activity) => void
  ) => {
    const message = validateForm(activity);
    if (message) toast.error(message, { position: 'bottom-right' });
    else activity && callback(activity);
  };

  const dataBlock = React.useMemo(() => {
    return activities?.map((activity: Activity) => (
      <TableRow key={activity.id} className="w-full">
        <ActivityCells activity={activity} />
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
                  setSelectedActivity(activity);
                  setUpdateDialog(true);
                }}>
                <Settings2 className="h-5 w-5 mr-2" /> Modifier
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedActivity(activity);
                  setDeleteDialog(true);
                }}>
                <Trash2 className="h-5 w-5 mr-2" /> Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [activities]);

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
        label="Suppression d'activité"
        description={
          <>
            Voulez-vous vraiment supprimer l&apos;activité avec l&apos;étiquette{' '}
            <span className="font-semibold">{selectedActivity?.label}</span>
          </>
        }
        onClose={() => setDeleteDialog(false)}
        positiveCallback={() => {
          selectedActivity && removeActivity(selectedActivity?.id || -1);
        }}
      />
      <UpdateDialog
        open={updateDialog}
        form={
          <ActivityForm
            activity={selectedActivity}
            onActivityChange={(activity: Activity) => setSelectedActivity(activity)}
          />
        }
        label="Modification d'activité"
        onClose={() => setUpdateDialog(false)}
        positiveCallback={() => {
          handleActivityForm(selectedActivity, updateActivity);
        }}
      />
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle>
              <div className="flex items-center">
                <Umbrella className="h-6 w-6 mr-2" />
                Nouvelle Activité
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ActivityForm
              activity={formActivity}
              onActivityChange={(activity: Activity) => setFormActivity(activity)}
            />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button
              onClick={() => {
                handleActivityForm(formActivity, createActivity);
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
              <Label className="font-semibold text-sm mx-2">Afficher</Label>
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

          <Table shimmerClassName="w-full" count={size} isPending={loading}>
            <TableHeader className="sticky top-0 z-10 bg-white">
              <TableRow>
                {!loading && (
                  <>
                    <TableHead className="w-11/12">
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
                    <TableHead className="w-1/12">Actions</TableHead>
                  </>
                )}
              </TableRow>
            </TableHeader>
            {!activities?.length ? (
              <EmptyTable message="Aucune activité trouvée" colSpan={2} />
            ) : (
              <TableBody>{dataBlock}</TableBody>
            )}
          </Table>
          <PaginationControls
            className="mt-5 justify-end"
            hasNextPage={activitiesResp?.meta.hasNextPage}
            hasPreviousPage={activitiesResp?.meta.hasPreviousPage}
            page={page}
            pageCount={activitiesResp?.meta.pageCount || 1}
            fetchCallback={(page: number) => setPage(page)}
          />
        </Container>
      </div>
    </>
  );
};

export default ActivityMain;

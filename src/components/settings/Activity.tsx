import React, { useMemo } from 'react';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Container } from '../common';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger
} from '../ui/dropdown-menu';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { MoreHorizontal } from 'lucide-react';
import { toast } from 'react-toastify';
import { isAlphabeticOrSpace } from '@/utils/validations/string.validations';
import { ChoiceDialog } from '../dialogs/ChoiceDialog';
import { PaginationControls } from '../common/PaginationControls';
import { Spinner } from '../common/Spinner';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '@/api';
import { Activity } from '@/api/types/activity';

interface ActivityProps {
  className?: string;
}

const ActivityComp: React.FC<ActivityProps> = ({ className }) => {
  const [label, setLabel] = React.useState('');
  const [open, setOpen] = React.useState(false);
  const [selectedActivity, setSelectedActivity] = React.useState<Activity | null>(null);
  const [page, setPage] = React.useState(1);
  const [size, setSize] = React.useState(5);
  const [order, setOrder] = React.useState(true);

  const {
    isPending: isFetchPending,
    error,
    data: activitiesResp,
    refetch: refetchActivities
  } = useQuery({
    queryKey: ['activities', page, size, order],
    queryFn: () => api.activity.find(page, size, order ? 'ASC' : 'DESC')
  });

  const activities = useMemo(() => {
    if (!activitiesResp) return [];
    return activitiesResp.data;
  }, [activitiesResp]);

  const { mutate: createActivity, isPending: isCreatePending } = useMutation({
    mutationFn: (data: any) => api.activity.create(data),
    onSuccess: () => {
      toast.success('Activité ajoutée avec succès', { position: 'top-center' });
      refetchActivities();
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la création de l'activité", {
        position: 'top-center'
      });
    }
  });

  const { mutate: removeActivity, isPending: isDeletePending } = useMutation({
    mutationFn: (id: any) => api.activity.remove(id),
    onSuccess: () => {
      if (activities?.length == 1 && page > 1) setPage(page - 1);
      toast.success('Activité supprimée avec succès', { position: 'top-center' });
      setTimeout(refetchActivities, 100);
      setSelectedActivity(null);
    },
    onError: (error: any) => {
      toast.error(error.response?.data?.message || "Erreur lors de la suppression de l'activité", {
        position: 'top-center'
      });
    }
  });

  const handleCreateActivity = async () => {
    if (label.length > 3 && isAlphabeticOrSpace(label)) {
      createActivity({ label: label });
    } else {
      toast.error('Veuillez entrer un titre valide', { position: 'top-center' });
    }
  };

  const dataBlock = useMemo(() => {
    return activities?.map((activity: any) => (
      <TableRow key={activity.id}>
        <TableCell className="font-medium">{activity.label}</TableCell>
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
              <DropdownMenuItem>Modifier</DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  setSelectedActivity(activity);
                  setOpen(true);
                }}>
                Supprimer
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </TableCell>
      </TableRow>
    ));
  }, [activities]);

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <>
      <ChoiceDialog
        open={open}
        prompt="Suppression d'activité"
        description={
          <>
            Voulez-vous vraiment supprimer l&apos;activité avec l&apos;étiquette{' '}
            <span className="font-semibold">{selectedActivity?.label}</span>
          </>
        }
        onClose={() => setOpen(false)}
        positiveCallback={() => {
          removeActivity(selectedActivity?.id);
        }}
      />
      <div className={className}>
        <Card>
          <CardHeader>
            <CardTitle>Nouvelle Activité</CardTitle>
          </CardHeader>
          <CardContent>
            <Input placeholder="Titre" onChange={(e) => setLabel(e.target.value)} />
          </CardContent>
          <CardFooter className="border-t px-6 py-4">
            <Button onClick={handleCreateActivity}>Enregistrer</Button>
          </CardFooter>
        </Card>
        <Container className="w-full my-4">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-11/12">Titre</TableHead>
                <TableHead className="w-1/12">Actions</TableHead>
              </TableRow>
            </TableHeader>
            {isFetchPending || isCreatePending || isDeletePending ? (
              <TableBody>
                <TableRow>
                  <TableCell colSpan={2}>
                    <Spinner className="m-5" />
                  </TableCell>
                </TableRow>
              </TableBody>
            ) : !activities?.length ? (
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

export default ActivityComp;

import { Firm } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectShimmer,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Skeleton } from '@/components/ui/skeleton';
import SortableLinks from '@/components/ui/sortable';
import { useInterlocutorManager } from '@/hooks/functions/useInterlocutorManager';
import {
  DndContext,
  KeyboardSensor,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from '@dnd-kit/core';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Briefcase, PlusSquareIcon } from 'lucide-react';
import React from 'react';

interface InterlocutorProfessionalInformationProps {
  className?: string;
  firms?: any;
  loading?: boolean;
}

export const InterlocutorProfessionalInformation: React.FC<
  InterlocutorProfessionalInformationProps
> = ({ className, firms, loading }) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const interlocutorManager = useInterlocutorManager();

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = interlocutorManager.firms.findIndex((item) => item.id === active.id);
      const newIndex = interlocutorManager.firms.findIndex((item) => item.id === over.id);
      interlocutorManager.setFirms(
        arrayMove(
          interlocutorManager?.firms?.map((item) => item.firmId),
          oldIndex,
          newIndex
        )
      );
    }
  }

  function handleDelete(idToDelete: string) {
    if (interlocutorManager?.firms?.length > 1) {
      interlocutorManager.delete(idToDelete);
    }
  }

  const addNewItem = () => {
    interlocutorManager.add();
  };

  const filterFirms = (selectedFirmId: number) => {
    return firms?.filter((firm: Partial<Firm>) => {
      return (
        firm.id === selectedFirmId ||
        !interlocutorManager.firms.some((selectedFirm) => selectedFirm.firmId === firm.id)
      );
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle className="border-b pb-2">
          <div className="flex items-center">
            <Briefcase className="h-7 w-7 mr-1" />
            <Label className="text-sm font-semibold">Information Professionnelles</Label>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div>
          <div className="grid gap-3 mt-4">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
              <SortableContext
                items={interlocutorManager.firms}
                strategy={verticalListSortingStrategy}>
                {loading && <Skeleton className="h-24 mr-2 my-5" />}
                {!loading &&
                  interlocutorManager.firms.map((item) => (
                    <SortableLinks key={item.id} id={item} onDelete={handleDelete}>
                      <SelectShimmer isPending={loading}>
                        <Select
                          key={item.id}
                          onValueChange={(e) => {
                            interlocutorManager.update(item.id, +e);
                          }}
                          value={item?.firmId?.toString()}>
                          <SelectTrigger>
                            <SelectValue placeholder="Choisissez une Entreprise" />
                          </SelectTrigger>
                          <SelectContent>
                            {filterFirms(item.firmId || 0)?.map((firm: Partial<Firm>) => (
                              <SelectItem
                                key={firm.id}
                                value={firm.id?.toString() || ''}
                                className="mx-1">
                                <span className="font-semibold">{firm.name}</span>{' '}
                                {firm.mainInterlocutor?.name && (
                                  <span>
                                    présenté par {firm.mainInterlocutor?.title}{' '}
                                    {firm.mainInterlocutor?.name}
                                  </span>
                                )}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </SelectShimmer>
                    </SortableLinks>
                  ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>{' '}
        <Button className="flex items-center ml-auto mt-5" onClick={addNewItem}>
          <PlusSquareIcon className="mr-2" />
          Ajouter une entreprise
        </Button>
      </CardContent>
    </Card>
  );
};

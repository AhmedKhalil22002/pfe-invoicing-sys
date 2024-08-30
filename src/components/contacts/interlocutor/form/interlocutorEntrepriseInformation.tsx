import { Firm } from '@/api';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
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
import { useTranslation } from 'react-i18next';

interface InterlocutorEntrepriseInformationProps {
  className?: string;
  firms?: any;
  loading?: boolean;
}

export const InterlocutorEntrepriseInformation: React.FC<
  InterlocutorEntrepriseInformationProps
> = ({ className, firms, loading }) => {
  const { t } = useTranslation('contacts');
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const interlocutorManager = useInterlocutorManager();

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (active && over && active.id !== over.id) {
      const oldIndex = interlocutorManager.entries.findIndex((item) => item.id === active.id);
      const newIndex = interlocutorManager.entries.findIndex((item) => item.id === over.id);
      interlocutorManager.setFirms(
        arrayMove(
          interlocutorManager.entries.map((item) => {
            return { id: item.firmId, position: item.position };
          }),
          oldIndex,
          newIndex
        )
      );
    }
  };

  const handleDelete = (idToDelete: string) => {
    if (interlocutorManager.entries.length > 1) {
      interlocutorManager.delete(idToDelete);
    }
  };

  const addNewItem = () => {
    interlocutorManager.add();
  };

  const filterFirms = (selectedFirmId: number | undefined) => {
    return firms?.filter((firm: Firm) => {
      return (
        firm.id === selectedFirmId ||
        !interlocutorManager.entries.some((selectedFirm) => selectedFirm.firmId === firm.id)
      );
    });
  };

  return (
    <Card className={className}>
      <CardHeader className="p-5">
        <CardTitle className="border-b pb-2">
          <div className="flex items-center">
            <Briefcase className="h-7 w-7 mr-1" />
            <Label className="text-sm font-semibold">{t('common.firm_information')}</Label>
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
                items={interlocutorManager.entries}
                strategy={verticalListSortingStrategy}>
                {loading && <Skeleton className="h-24 mr-2 my-5" />}
                {!loading &&
                  interlocutorManager.entries.map((item) => {
                    return (
                      <SortableLinks key={item.id} id={item} onDelete={handleDelete}>
                        <div className="mx-2 flex gap-6">
                          <div className="w-1/2">
                            <Label>Entreprise :</Label>
                            <SelectShimmer isPending={loading} className="w-1/2">
                              <Select
                                key={item.id}
                                onValueChange={(e) => {
                                  interlocutorManager.update({ ...item, firmId: +e });
                                }}
                                value={item?.firmId?.toString()}>
                                <SelectTrigger>
                                  <SelectValue
                                    placeholder={t('interlocutor.associate_firm_prompt')}
                                  />
                                </SelectTrigger>
                                <SelectContent>
                                  {filterFirms(item.firmId || 0)?.map((firm: Partial<Firm>) => {
                                    const mainInterlocutor = firm.interlocutorsToFirm?.find(
                                      (interlocutor) => interlocutor.isMain
                                    )?.interlocutor;
                                    return (
                                      <SelectItem
                                        key={firm.id}
                                        value={firm.id?.toString() || ''}
                                        className="mx-1">
                                        <span className="font-semibold">{firm.name}</span>{' '}
                                        {mainInterlocutor?.name && (
                                          <span>
                                            {t('firm.presented_by')} {mainInterlocutor?.title}{' '}
                                            {mainInterlocutor?.name}
                                          </span>
                                        )}
                                      </SelectItem>
                                    );
                                  })}
                                </SelectContent>
                              </Select>
                            </SelectShimmer>
                          </div>
                          <div className="w-1/2 -mt-1">
                            <Label>Position/Role : </Label>
                            <Input
                              className="mt-2"
                              placeholder="Ex. Departement  Director"
                              value={item.position}
                              onChange={(e) =>
                                interlocutorManager.update({ ...item, position: e.target.value })
                              }
                            />
                          </div>
                        </div>
                      </SortableLinks>
                    );
                  })}
              </SortableContext>
            </DndContext>
          </div>
        </div>{' '}
        <Button className="flex items-center mt-5" onClick={addNewItem}>
          <PlusSquareIcon className="mr-2" />
          {t('interlocutor.associate_firm')}
        </Button>
      </CardContent>
    </Card>
  );
};

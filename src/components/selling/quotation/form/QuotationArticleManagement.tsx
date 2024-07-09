import React from 'react';
import { cn } from '@/lib/utils';
import {
  useSensors,
  useSensor,
  PointerSensor,
  KeyboardSensor,
  DndContext,
  closestCenter
} from '@dnd-kit/core';
import {
  SortableContext,
  arrayMove,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy
} from '@dnd-kit/sortable';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import SortableLinks from '@/components/ui/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { ArticleFormItem } from '@/components/invoicing-commons/articles/ArticleFormItem';
import { CreateQuotationDto, Tax } from '@/api';
import { register } from 'module';
import { Label } from '@/components/ui/label';
import { UseFormWatch } from 'react-hook-form';

interface QuotationArticleManagementProps {
  className?: string;
  taxes: Tax[];
  register: any;
  control: any;
  watch: UseFormWatch<CreateQuotationDto>;
}
interface Item {
  name: string;
  id: number;
}

export const QuotationArticleManagement: React.FC<QuotationArticleManagementProps> = ({
  className,
  taxes = [],
  register,
  control,
  watch
}) => {
  const currencySymbol = watch('firm.currency.symbol') || '';
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const [items, setItems] = React.useState<Item[]>([
    { name: 'NextJS', id: 1693653637084 },
    { name: 'ReactJS', id: 1693653637086 },
    { name: 'Astro', id: 1693653637088 },
    { name: 'Vue', id: 1693653637090 }
  ]);

  function handleDragEnd(event: any) {
    const { active, over } = event;

    if (active.id !== over.id) {
      setItems((prevItems) => {
        const oldIndex = prevItems.findIndex((item) => item.id === active.id);
        const newIndex = prevItems.findIndex((item) => item.id === over.id);

        return arrayMove(prevItems, oldIndex, newIndex);
      });
    }
  }

  function handleDelete(idToDelete: number) {
    setItems((prevItems) => prevItems.filter((item) => item.id !== idToDelete));
  }

  let idx = Date.now();

  function addNewItem(newItem: string) {
    setItems((prevItems) => [...prevItems, { name: newItem, id: idx }]);
  }

  return (
    <div className="border-b">
      <Card className={cn('w-full border-0 shadow-none', className)}>
        <CardHeader className="space-y-1 ">
          <CardTitle className="text-2xl flex justify-between">Gestion Articles</CardTitle>
          <CardDescription>Lister les articles de Devis</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-4">
          <div>
            <Label></Label>
          </div>
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
            <SortableContext items={items} strategy={verticalListSortingStrategy}>
              {items.map((item) => (
                <SortableLinks key={item.id} id={item} onDelete={handleDelete}>
                  <ArticleFormItem
                    taxes={taxes}
                    register={register}
                    control={control}
                    watch={watch}
                    currencySymbol={currencySymbol}
                  />
                </SortableLinks>
              ))}
            </SortableContext>
          </DndContext>
        </CardContent>
      </Card>
    </div>
  );
};

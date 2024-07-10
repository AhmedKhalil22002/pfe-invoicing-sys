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
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import SortableLinks from '@/components/ui/sortable';
import { restrictToParentElement, restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { ArticleFormItem } from '@/components/invoicing-commons/articles/ArticleFormItem';
import { CreateQuotationDto, Tax } from '@/api';
import { register } from 'module';
import { Label } from '@/components/ui/label';
import { UseFormWatch } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { PlusSquareIcon } from 'lucide-react';

interface QuotationArticleManagementProps {
  className?: string;
  taxes: Tax[];
  watch: UseFormWatch<CreateQuotationDto>;
}
interface Item {
  name: string;
  id: number;
}

export const QuotationArticleManagement: React.FC<QuotationArticleManagementProps> = ({
  className,
  taxes = [],
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
    { name: 'X', id: 1693653637084 },
    { name: 'X', id: 1693653637085 }
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
    <div className="border-b -mx-4">
      <Card className={cn('w-full border-0 shadow-none', className)}>
        <CardHeader className="space-y-1 w-full">
          <CardTitle className="text-2xl flex justify-between">Gestion Articles</CardTitle>
          <CardDescription>Lister les articles de Devis</CardDescription>
        </CardHeader>
        <CardContent className="grid gap-3">
          <div className="flex flex-row">
            <Label className="w-3/12  text-center">Article</Label>
            <Label className="w-2/12  text-center">Qte.</Label>
            <Label className="w-3/12  text-center">P.U</Label>
            <Label className="w-2/12  text-center">Taxe</Label>
            <Label className="w-2/12  text-center">Prix</Label>
          </div>
          <div className="grid gap-3">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
              <SortableContext items={items} strategy={verticalListSortingStrategy}>
                {items.map((item) => (
                  <SortableLinks key={item.id} id={item} onDelete={handleDelete}>
                    <ArticleFormItem taxes={taxes} watch={watch} currencySymbol={currencySymbol} />
                  </SortableLinks>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="flex items-center">
            <PlusSquareIcon className="mr-2" />
            Ajouter un article
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

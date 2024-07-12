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
import { Currency, Tax, api } from '@/api';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusSquareIcon } from 'lucide-react';
import { useQuotationArticleManager } from '@/hooks/functions/useArticleManager';

interface QuotationArticleManagementProps {
  className?: string;
  taxes: Tax[];
  isArticleDescriptionHidden: boolean;
  currency?: Currency;
}

export const QuotationArticleManagement: React.FC<QuotationArticleManagementProps> = ({
  className,
  taxes = [],
  isArticleDescriptionHidden,
  currency
}) => {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  const quotationStore = useQuotationArticleManager();
  const items = quotationStore((state) => state.articles);
  const addItem = quotationStore((state) => state.add);
  const updateItem = quotationStore((state) => state.update);
  const deleteItem = quotationStore((state) => state.delete);
  const setItems = quotationStore((state) => state.setArticles);
  const resetItems = quotationStore((state) => state.reset);

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = items.findIndex((item) => item.id === active.id);
      const newIndex = items.findIndex((item) => item.id === over.id);
      setItems(arrayMove(items, oldIndex, newIndex));
    }
  }

  function handleDelete(idToDelete: string) {
    if (items.length > 1) {
      deleteItem(idToDelete);
    }
  }

  function addNewItem() {
    addItem(api.article.factory());
  }
  if (items.length == 0) {
    addItem(api.article.factory());
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
            <Label className="w-1/5 text-center">Article</Label>
            <Label className="w-1/5 text-center">Qte.</Label>
            <Label className="w-1/5 text-center">P.U</Label>
            <Label className="w-1/5 text-center">Taxe</Label>
            <Label className="w-1/5 text-center">Prix</Label>
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
                    <ArticleFormItem
                      article={item.article}
                      onChange={(article) => updateItem(item.id, article)}
                      taxes={taxes}
                      showDescription={!isArticleDescriptionHidden}
                      currencySymbol={currency?.symbol || '$'}
                    />
                  </SortableLinks>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </CardContent>
        <CardFooter>
          <Button className="flex items-center" onClick={addNewItem}>
            <PlusSquareIcon className="mr-2" />
            Ajouter un article
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

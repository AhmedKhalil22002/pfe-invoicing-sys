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
import { Currency, Tax, api } from '@/api';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { PlusSquareIcon } from 'lucide-react';
import { Skeleton } from '@/components/ui/skeleton';
import { QuotationArticleItem } from './QuotationArticleItem';
import { useQuotationArticleManagerStore } from '../hooks/useQuotationArticleManager';

interface QuotationArticleManagementProps {
  className?: string;
  taxes: Tax[];
  isArticleDescriptionHidden: boolean;
  currency?: Currency;
  loading?: boolean;
}
export const QuotationArticleManagement: React.FC<QuotationArticleManagementProps> = ({
  className,
  taxes = [],
  isArticleDescriptionHidden,
  currency,
  loading
}) => {
  const articleManager = useQuotationArticleManagerStore();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = articleManager.articles.findIndex((item) => item.id === active.id);
      const newIndex = articleManager.articles.findIndex((item) => item.id === over.id);
      articleManager.setArticles(
        arrayMove(
          articleManager.articles.map((item) => item.article),
          oldIndex,
          newIndex
        )
      );
    }
  }

  function handleDelete(idToDelete: string) {
    if (articleManager.articles.length > 1) {
      articleManager.delete(idToDelete);
    }
  }

  const addNewItem = React.useCallback(() => {
    articleManager.add(api.article.factory());
  }, [articleManager.add]);

  return (
    <div className="border-b -mx-4">
      <Card className={cn('w-full border-0 shadow-none', className)}>
        <CardHeader className="space-y-1 w-full">
          <div className="flex flex-row items-center">
            <div>
              <CardTitle className="text-2xl flex justify-between">Gestion Articles</CardTitle>
              <CardDescription>Lister les articles de Devis</CardDescription>
            </div>

            <Button className="flex items-center ml-auto" onClick={addNewItem}>
              <PlusSquareIcon className="mr-2" />
              Ajouter un article
            </Button>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          {articleManager.articles.length != 0 && (
            <div className="flex flex-row">
              <Label className="w-1/5 text-center">Article</Label>
              <Label className="w-1/5 text-center">Qte.</Label>
              <Label className="w-1/5 text-center">P.U</Label>
              <Label className="w-1/5 text-center">Taxe</Label>
              <Label className="w-1/5 text-center">Prix</Label>
            </div>
          )}
          <div className="grid gap-3">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragEnd={handleDragEnd}
              modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
              <SortableContext
                items={articleManager.articles}
                strategy={verticalListSortingStrategy}>
                {loading && <Skeleton className="h-24 mr-2 my-5" />}
                {!loading &&
                  articleManager.articles.map((item) => (
                    <SortableLinks key={item.id} id={item} onDelete={handleDelete}>
                      <QuotationArticleItem
                        article={item.article}
                        onChange={(article) => articleManager.update(item.id, article)}
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
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

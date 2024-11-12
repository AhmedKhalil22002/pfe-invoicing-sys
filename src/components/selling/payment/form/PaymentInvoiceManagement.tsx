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
import { Currency } from '@/types';
import { Skeleton } from '@/components/ui/skeleton';
import { useTranslation } from 'react-i18next';
import { usePaymentInvoiceManager } from '../hooks/usePaymentInvoiceManager';
import { PaymentInvoiceItem } from './PaymentInvoiceItem';

interface PaymentInvoiceManagementProps {
  className?: string;
  currency?: Currency;
  loading?: boolean;
}
export const PaymentInvoiceManagement: React.FC<PaymentInvoiceManagementProps> = ({
  className,
  currency,
  loading
}) => {
  const { t: tInvoicing } = useTranslation('invoicing');
  const invoiceManager = usePaymentInvoiceManager();
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates
    })
  );

  function handleDragEnd(event: any) {
    const { active, over } = event;
    if (active.id !== over.id) {
      const oldIndex = invoiceManager.invoices.findIndex((item) => item.id === active.id);
      const newIndex = invoiceManager.invoices.findIndex((item) => item.id === over.id);
      invoiceManager.setInvoices(
        arrayMove(
          invoiceManager.invoices.map((item) => item.invoice),
          oldIndex,
          newIndex
        )
      );
    }
  }

  return (
    <div className="border-b">
      <Card className={cn('w-full border-0 shadow-none', className)}>
        <CardHeader className="space-y-1 w-full">
          <div className="flex flex-row items-center">
            <div>
              <CardTitle className="text-2xl flex justify-between">
                {tInvoicing('invoice.plural')}
              </CardTitle>
              <CardDescription>{tInvoicing('article.manager-statement')}</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="grid gap-3">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis, restrictToParentElement]}>
            <SortableContext items={invoiceManager.invoices} strategy={verticalListSortingStrategy}>
              {loading && <Skeleton className="h-24 mr-2 my-5" />}
              {!loading &&
                invoiceManager.invoices.map((item) => (
                  <SortableLinks key={item.id} id={item}>
                    <PaymentInvoiceItem
                      invoiceEntry={item.invoice}
                      currency={currency}
                      onChange={(invoice) => invoiceManager.update(item.id, invoice)}
                    />
                  </SortableLinks>
                ))}
            </SortableContext>
          </DndContext>
        </CardContent>
        <CardFooter></CardFooter>
      </Card>
    </div>
  );
};

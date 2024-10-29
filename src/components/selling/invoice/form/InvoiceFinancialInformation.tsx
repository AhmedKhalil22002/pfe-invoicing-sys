import React from 'react';
import { Currency } from '@/types';
import { DISCOUNT_TYPE } from '@/types/enums/discount-types';
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
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { useInvoiceArticleManager } from '../hooks/useInvoiceArticleManager';
import { useInvoiceManager } from '../hooks/useInvoiceManager';

interface InvoiceFinancialInformationProps {
  className?: string;
  total: number;
  subTotal?: number;
  discount?: number;
  currency?: Currency;
  loading?: boolean;
}

export const InvoiceFinancialInformation = ({
  className,
  subTotal,
  total,
  currency,
  loading
}: InvoiceFinancialInformationProps) => {
  const { t: tInvoicing } = useTranslation('invoicing');

  const invoiceArticleManager = useInvoiceArticleManager();
  const invoiceManager = useInvoiceManager();
  const currencySymbol = currency?.symbol || '$';
  const digitAfterComma = currency?.digitAfterComma || 3;
  const discount = invoiceManager.discount ?? 0;
  const discountType =
    invoiceManager.discountType === DISCOUNT_TYPE.PERCENTAGE ? 'PERCENTAGE' : 'AMOUNT';

  return (
    <div className={cn(className)}>
      <div className="flex flex-col w-full border-b">
        <div className="flex my-2">
          <Label className="mr-auto">{tInvoicing('invoice.attributes.sub_total')}</Label>
          <Label className="ml-auto" isPending={loading || false}>
            {subTotal?.toFixed(digitAfterComma)} {currencySymbol}
          </Label>
        </div>

        {invoiceArticleManager.taxSummary.map((ts) => {
          return (
            <div key={ts.tax.id} className="flex my-2">
              <Label className="mr-auto">{ts.tax.label}</Label>
              <Label className="ml-auto" isPending={loading || false}>
                {ts.amount?.toFixed(digitAfterComma)} {currencySymbol}
              </Label>
            </div>
          );
        })}

        <div className="flex items-center my-2">
          <Label className="mr-auto">{tInvoicing('invoice.attributes.discount')}</Label>
          <div className="flex items-center gap-2">
            <Input
              className="ml-auto w-2/5 text-right"
              type="number"
              value={discount}
              onChange={(e) => invoiceManager.set('discount', parseFloat(e.target.value))}
              isPending={loading || false}
            />
            <SelectShimmer isPending={loading || false} className="-mt-0.5 w-1/5">
              <Select
                onValueChange={(value: string) => {
                  invoiceManager.set(
                    'discountType',
                    value === 'PERCENTAGE' ? DISCOUNT_TYPE.PERCENTAGE : DISCOUNT_TYPE.AMOUNT
                  );
                }}
                value={discountType}>
                <SelectTrigger className="w-fit">
                  <SelectValue placeholder="%" />
                </SelectTrigger>
                <SelectContent align="start">
                  <SelectItem value="PERCENTAGE">%</SelectItem>
                  <SelectItem value="AMOUNT">{currencySymbol} </SelectItem>
                </SelectContent>
              </Select>
            </SelectShimmer>
          </div>
        </div>
      </div>
      <div className="flex flex-col w-full mt-2">
        <div className="flex my-2">
          <Label className="mr-auto">{tInvoicing('invoice.attributes.total')}</Label>
          <Label className="ml-auto" isPending={loading || false}>
            {total?.toFixed(digitAfterComma)} {currencySymbol}
          </Label>
        </div>
      </div>
    </div>
  );
};

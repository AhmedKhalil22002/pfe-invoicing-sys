import { CreateQuotationDto, Currency } from '@/api';
import { DiscountType } from '@/api/enums/discount-types';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { useInvoicingManager } from '@/hooks/functions/useInvoicingInformations';
import { cn } from '@/lib/utils';
import React from 'react';
import { Control, Controller, UseFormRegister, UseFormWatch } from 'react-hook-form';
interface QuotationFinancialInformationsProps {
  className?: string;
  isTaxStampHidden?: boolean;
  total: number;
  subTotal?: number;
  discount?: number;
  taxStamp?: number;
  currency?: Currency;
  loading?: boolean;
}

export const QuotationFinancialInformations = ({
  className,
  isTaxStampHidden,
  subTotal,
  total,
  currency
}: QuotationFinancialInformationsProps) => {
  const quotationManager = useInvoicingManager();
  const currencySymbol = currency?.symbol || '$';
  return (
    <div className={cn(className)}>
      <div className="flex flex-col w-full border-b">
        <div className="flex my-2">
          <Label className="mr-auto">Sous total</Label>
          <Label className="ml-auto">
            {subTotal?.toFixed(3)} {currencySymbol}
          </Label>
        </div>
        <div className="flex items-center my-2">
          <Label className="mr-auto">Remise</Label>
          <div className="flex items-center mt-2 gap-2">
            <Input
              className="ml-auto w-2/5 text-right"
              type="number"
              value={quotationManager.discount}
              onChange={(e) => quotationManager.set('discount', +e.target.value)}
            />

            <Select
              onValueChange={(value: string) => {
                quotationManager.set(
                  'discountType',
                  value === 'PERCENTAGE' ? DiscountType.PERCENTAGE : DiscountType.AMOUNT
                );
              }}
              defaultValue={
                quotationManager.discountType === DiscountType.PERCENTAGE ? 'PERCENTAGE' : 'AMOUNT'
              }>
              <SelectTrigger className="-mt-0.5 w-1/5">
                <SelectValue placeholder="%" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">%</SelectItem>
                <SelectItem value="AMOUNT">{currencySymbol} </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        {!isTaxStampHidden && (
          <div className="flex items-center my-2">
            <Label className="mr-auto">Timbre Fiscal</Label>
            <Input
              className="ml-auto w-1/6 text-right"
              type="number"
              value={quotationManager.taxStamp}
              onChange={(e) => quotationManager.set('taxStamp', +e.target.value)}
            />
            <span className="w-5 ml-1 text-center">{currencySymbol}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full mt-2">
        <div className="flex my-2">
          <Label className="mr-auto">Total</Label>
          <Label className="ml-auto">
            {total?.toFixed(3)} {currencySymbol}
          </Label>
        </div>
      </div>
    </div>
  );
};

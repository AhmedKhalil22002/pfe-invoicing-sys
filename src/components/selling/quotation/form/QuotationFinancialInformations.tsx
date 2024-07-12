import { CreateQuotationDto, Currency } from '@/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React from 'react';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
interface QuotationFinancialInformationsProps {
  className?: string;
  isTaxStampHidden?: boolean;
  total: number;
  subTotal?: number;
  discount?: number;
  taxStamp?: number;
  currency?: Currency;
  register: UseFormRegister<CreateQuotationDto>;
  loading?: boolean;
}

export const QuotationFinancialInformations = ({
  className,
  isTaxStampHidden,
  subTotal,
  total,
  register,
  currency
}: QuotationFinancialInformationsProps) => {
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
          <Input
            className="ml-auto w-1/6 text-right"
            type="number"
            min="0"
            {...register('discount', {
              valueAsNumber: true
            })}
          />
          <span className="w-5 ml-1 text-center">{currencySymbol}</span>
        </div>
        {!isTaxStampHidden && (
          <div className="flex items-center my-2">
            <Label className="mr-auto">Timbre Fiscal</Label>
            <Input
              className="ml-auto w-1/6 text-right"
              type="number"
              {...register('taxStamp', {
                valueAsNumber: true
              })}
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

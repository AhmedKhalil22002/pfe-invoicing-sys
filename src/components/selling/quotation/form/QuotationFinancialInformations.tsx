import { CreateQuotationDto } from '@/api';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import React from 'react';
import { UseFormRegister, UseFormWatch } from 'react-hook-form';
interface QuotationFinancialInformationsProps {
  className?: string;
  subTotal?: number;
  discount?: number;
  isTaxStampHidden?: boolean;
  taxStamp?: number;
  totals?: number;
  loading?: boolean;
  register: UseFormRegister<CreateQuotationDto>;
  watch: UseFormWatch<CreateQuotationDto>;
}

export const QuotationFinancialInformations = ({
  className,
  isTaxStampHidden,
  register,
  watch
}: QuotationFinancialInformationsProps) => {
  const currencySymbol = watch('firm.currency.symbol') || '';
  return (
    <div className={cn(className)}>
      <div className="flex flex-col w-full border-b">
        <div className="flex my-2">
          <Label className="mr-auto">Sous total</Label>
          <Label className="ml-auto">0.000 {currencySymbol}</Label>
        </div>
        <div className="flex items-center my-2">
          <Label className="mr-auto">Remise</Label>
          <Input className="ml-auto w-1/6 text-right" type="number" {...register('discount')} />
          <span className="w-5 ml-1 text-center">%</span>
        </div>
        {!isTaxStampHidden && (
          <div className="flex items-center my-2">
            <Label className="mr-auto">Timbre Fiscal</Label>
            <Input className="ml-auto w-1/6 text-right" type="number" {...register('taxStamp')} />
            <span className="w-5 ml-1 text-center">{currencySymbol}</span>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full mt-2">
        <div className="flex my-2">
          <Label className="mr-auto">Total</Label>
          <Label className="ml-auto">0.000 {currencySymbol}</Label>
        </div>
      </div>
    </div>
  );
};

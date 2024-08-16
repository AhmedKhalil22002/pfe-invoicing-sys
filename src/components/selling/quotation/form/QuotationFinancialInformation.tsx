import { Currency } from '@/api';
import { DISCOUNT_TYPE } from '@/api/enums/discount-types';
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
import { useQuotationManager } from '@/components/selling/quotation/hooks/useQuotationManager';
import { cn } from '@/lib/utils';
import React from 'react';

interface QuotationFinancialInformationProps {
  className?: string;
  isTaxStampHidden?: boolean;
  total: number;
  subTotal?: number;
  discount?: number;
  taxStamp?: number;
  currency?: Currency;
  loading?: boolean;
}

export const QuotationFinancialInformation = ({
  className,
  isTaxStampHidden,
  subTotal,
  total,
  currency,
  loading
}: QuotationFinancialInformationProps) => {
  const quotationManager = useQuotationManager();
  const currencySymbol = currency?.symbol || '$';
  const digitAfterComma = currency?.digitAfterComma || 3;
  const discount = quotationManager.discount ?? 0;
  const taxStamp = quotationManager.taxStamp ?? 0;
  const discountType =
    quotationManager.discountType === DISCOUNT_TYPE.PERCENTAGE ? 'PERCENTAGE' : 'AMOUNT';

  return (
    <div className={cn(className)}>
      <div className="flex flex-col w-full border-b">
        <div className="flex my-2">
          <Label className="mr-auto">Sous total</Label>
          <Label className="ml-auto" isPending={loading || false}>
            {subTotal?.toFixed(digitAfterComma)} {currencySymbol}
          </Label>
        </div>
        <div className="flex items-center my-2">
          <Label className="mr-auto">Remise</Label>
          <div className="flex items-center mt-2 gap-2">
            <Input
              className="ml-auto w-2/5 text-right"
              type="number"
              value={discount}
              onChange={(e) => quotationManager.set('discount', parseFloat(e.target.value))}
              isPending={loading || false}
            />
            <SelectShimmer isPending={loading || false} className="-mt-0.5 w-1/5">
              <Select
                onValueChange={(value: string) => {
                  quotationManager.set(
                    'discountType',
                    value === 'PERCENTAGE' ? DISCOUNT_TYPE.PERCENTAGE : DISCOUNT_TYPE.AMOUNT
                  );
                }}
                value={discountType}>
                <SelectTrigger className="-mt-0.5 w-1/5">
                  <SelectValue placeholder="%" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">%</SelectItem>
                  <SelectItem value="AMOUNT">{currencySymbol} </SelectItem>
                </SelectContent>
              </Select>
            </SelectShimmer>
          </div>
        </div>
        {!isTaxStampHidden && (
          <div className="flex items-center my-2">
            <Label className="mr-auto">Timbre Fiscal</Label>
            <Input
              className="ml-auto w-1/6 text-right"
              type="number"
              value={taxStamp}
              onChange={(e) => quotationManager.set('taxStamp', parseFloat(e.target.value))}
              isPending={loading || false}
            />
            <Label isPending={loading || false} className="w-5 ml-1 text-center">
              {currencySymbol}
            </Label>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full mt-2">
        <div className="flex my-2">
          <Label className="mr-auto">Total</Label>
          <Label className="ml-auto" isPending={loading || false}>
            {total?.toFixed(digitAfterComma)} {currencySymbol}
          </Label>
        </div>
      </div>
    </div>
  );
};

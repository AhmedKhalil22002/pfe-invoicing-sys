import React from 'react';
import { Currency, INVOICE_STATUS, Tax } from '@/types';
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
import { useInvoiceControlManager } from '../hooks/useInvoiceControlManager';

interface InvoiceFinancialInformationProps {
  className?: string;
  total?: number;
  amountPaid?: number;
  status: INVOICE_STATUS;
  subTotal?: number;
  discount?: number;
  currency?: Currency;
  taxes: Tax[];
  loading?: boolean;
}

export const InvoiceFinancialInformation = ({
  className,
  subTotal,
  total,
  amountPaid,
  status,
  currency,
  taxes,
  loading
}: InvoiceFinancialInformationProps) => {
  const { t: tInvoicing } = useTranslation('invoicing');

  const invoiceArticleManager = useInvoiceArticleManager();
  const invoiceManager = useInvoiceManager();
  const controlManager = useInvoiceControlManager();
  const currencySymbol = currency?.symbol || '$';
  const digitAfterComma = currency?.digitAfterComma || 3;
  const discount = invoiceManager.discount ?? 0;
  const discountType =
    invoiceManager.discountType === DISCOUNT_TYPE.PERCENTAGE ? 'PERCENTAGE' : 'AMOUNT';
  const remaining_amount = (total || 0) - (amountPaid || 0);

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
        {/* discount */}
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
        {/* tax stamp */}
        {!controlManager.isTaxStampHidden && (
          <div className="flex items-center my-2">
            <Label className="w-1/3">{tInvoicing('invoice.attributes.tax_stamp')}</Label>
            <SelectShimmer isPending={loading || false} className="-mt-0.5 ">
              <Select
                onValueChange={(value: string) => {
                  invoiceManager.set('taxStampId', parseInt(value));
                }}
                defaultValue={invoiceManager.taxStampId?.toString()}>
                <SelectTrigger className="w-2/3">
                  <SelectValue
                    placeholder={`${'0.'.padEnd(digitAfterComma + 2, '0')} ${currencySymbol}`}
                  />
                </SelectTrigger>
                <SelectContent align="start">
                  {taxes.map((tax) => {
                    return (
                      <SelectItem key={tax.id} value={tax?.id?.toString() || ''}>
                        {tax.label} ({tax.value?.toFixed(digitAfterComma) || 0} {currencySymbol})
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </SelectShimmer>
          </div>
        )}
      </div>
      <div className="flex flex-col w-full mt-2">
        <div className="flex my-2">
          <Label className="mr-auto">{tInvoicing('invoice.attributes.total')}</Label>
          <Label className="ml-auto" isPending={loading || false}>
            {total?.toFixed(digitAfterComma)} {currencySymbol}
          </Label>
        </div>
      </div>
      {[INVOICE_STATUS.PartiallyPaid, INVOICE_STATUS.Unpaid].includes(status) && (
        <div className="flex flex-col w-full mt-2">
          <div className="flex my-2">
            <Label className="mr-auto">{tInvoicing('invoice.attributes.remaining_amount')}</Label>
            <Label className="ml-auto" isPending={loading || false}>
              {remaining_amount?.toFixed(digitAfterComma)} {currencySymbol}
            </Label>
          </div>
        </div>
      )}
    </div>
  );
};

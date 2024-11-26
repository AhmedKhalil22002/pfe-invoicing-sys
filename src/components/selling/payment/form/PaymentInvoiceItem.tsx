import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Currency, PaymentInvoiceEntry } from '@/types';
import { transformDate } from '@/utils/date.utils';
import { ciel } from '@/utils/number.utils';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface PaymentInvoiceItemProps {
  className?: string;
  currency?: Currency;
  invoiceEntry: PaymentInvoiceEntry;
  convertionRate: number;
  onChange: (item: PaymentInvoiceEntry) => void;
}

export const PaymentInvoiceItem: React.FC<PaymentInvoiceItemProps> = ({
  className,
  currency,
  invoiceEntry,
  convertionRate,
  onChange
}) => {
  const router = useRouter();
  const { t: tInvoicing } = useTranslation('invoicing');
  //get digit after comma for a specific invoice

  const digitAfterComma = React.useMemo(() => currency?.digitAfterComma || 0, [currency]);

  const customCiel = React.useCallback((n: number) => ciel(n, digitAfterComma), [digitAfterComma]);

  const invoiceCurrency = React.useMemo(() => invoiceEntry.invoice?.currency, [invoiceEntry]);
  const total = React.useMemo(() => invoiceEntry.invoice?.total || 0, [invoiceEntry]);
  const amountPaid = React.useMemo(() => invoiceEntry.invoice?.amountPaid || 0, [invoiceEntry]);
  const taxWithholdingAmount = React.useMemo(
    () => invoiceEntry.invoice?.taxWithholdingAmount || 0,
    [invoiceEntry]
  );

  const remainingAmount = React.useMemo(() => {
    return customCiel(total - amountPaid - taxWithholdingAmount);
  }, [total, amountPaid, taxWithholdingAmount, customCiel]);

  const currentRemainingAmount = React.useMemo(() => {
    const convertedAmount =
      (invoiceEntry.amount || 0) * (invoiceCurrency?.id === currency?.id ? 1 : convertionRate || 1);
    return customCiel(remainingAmount - convertedAmount);
  }, [remainingAmount, invoiceEntry.amount, convertionRate, invoiceCurrency, currency, customCiel]);

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawValue = parseFloat(e.target.value) || 0;
    const roundedValue = customCiel(rawValue);
    onChange({ ...invoiceEntry, amount: roundedValue });
  };

  return (
    <div className={cn('flex flex-row items-center justify-between', className)}>
      {/* Invoice Sequential */}
      <div className="w-2/12 flex flex-col gap-2">
        <Label className="font-thin">{tInvoicing('invoice.singular')} N°</Label>
        <Label
          className="underline cursor-pointer"
          onClick={() => {
            router.push(`/selling/invoice/${invoiceEntry.invoice?.id}`);
          }}>
          {invoiceEntry.invoice?.sequential}
        </Label>
      </div>
      {/* Invoice Due Date */}
      <div className="w-2/12 flex flex-col gap-2">
        <Label className="font-thin">{tInvoicing('invoice.attributes.due_date')}</Label>
        <Label>
          {invoiceEntry.invoice?.dueDate ? (
            transformDate(invoiceEntry.invoice?.dueDate)
          ) : (
            <span>Sans date</span>
          )}
        </Label>
      </div>
      {/* Total */}
      <div className="w-1/12 flex flex-col gap-2">
        <Label className="font-thin">{tInvoicing('invoice.attributes.total')}</Label>
        <Label>
          {invoiceEntry?.invoice?.total?.toFixed(invoiceCurrency?.digitAfterComma)}{' '}
          {invoiceCurrency?.symbol}
        </Label>
      </div>
      {/* amountPaid */}
      <div className="w-2/12 flex flex-col gap-2">
        <Label className="font-thin">{tInvoicing('invoice.attributes.payment')}</Label>
        <Input type="number" onChange={handleAmountPaidChange} value={invoiceEntry.amount || 0} />
      </div>
      {/* remainingAmount */}
      <div className="w-2/12 flex flex-col gap-2">
        <Label className="font-thin">{tInvoicing('invoice.attributes.remaining_amount')}</Label>
        <Label>
          {currentRemainingAmount?.toFixed(invoiceCurrency?.digitAfterComma)}{' '}
          {invoiceCurrency?.symbol}
        </Label>
      </div>
    </div>
  );
};

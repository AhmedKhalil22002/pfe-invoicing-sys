import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { Currency, PaymentInvoiceEntry } from '@/types';
import { approximateNumber } from '@/utils/number.utils';
import { useRouter } from 'next/router';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface PaymentInvoiceItemProps {
  className?: string;
  currency?: Currency;
  invoiceEntry: PaymentInvoiceEntry;
  onChange: (item: PaymentInvoiceEntry) => void;
}

export const PaymentInvoiceItem: React.FC<PaymentInvoiceItemProps> = ({
  className,
  currency,
  invoiceEntry,
  onChange
}) => {
  const router = useRouter();
  const { t: tInvoicing } = useTranslation('invoicing');

  const digitAfterComma = currency?.digitAfterComma || 2;

  const approximate = (n: number) => approximateNumber(n, digitAfterComma);

  const remainingAmount = React.useMemo(() => {
    return approximate(
      (invoiceEntry.invoice?.total ?? 0) - (invoiceEntry.invoice?.amountPaid ?? 0)
    );
  }, [invoiceEntry.invoice?.total, invoiceEntry.invoice?.amountPaid]);

  const currentRemainingAmount = React.useMemo(() => {
    return approximate(
      (remainingAmount ?? 0) - (invoiceEntry.amount ?? 0) * (invoiceEntry.convertionRate ?? 1)
    );
  }, [remainingAmount, invoiceEntry.amount, invoiceEntry.convertionRate]);

  const invoiceCurrency = React.useMemo(() => {
    return invoiceEntry.invoice?.currency;
  }, [invoiceEntry.invoice?.currency]);

  const handleAmountPaidChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...invoiceEntry,
      amount: parseFloat(e.target.value)
    });
  };

  const handleConvertionRateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...invoiceEntry,
      convertionRate: parseFloat(e.target.value)
    });
  };

  return (
    <div className={cn('flex flex-row items-center gap-6', className)}>
      {/* Invoice Sequential */}
      <div className="w-2/12 block">
        <Label className="font-thin block">{tInvoicing('invoice.singular')} N°</Label>
        <Label
          className="underline cursor-pointer"
          onClick={() => {
            router.push(`/selling/invoice/${invoiceEntry.invoice?.id}`);
          }}>
          {invoiceEntry.invoice?.sequential}
        </Label>
      </div>
      {/* Total */}
      <div className="w-2/12 flex flex-col gap-2 items-center">
        <Label className="font-thin block">{tInvoicing('invoice.attributes.total')}</Label>
        <Label>
          {(invoiceEntry?.invoice?.total || 0).toFixed(invoiceCurrency?.digitAfterComma || 3)}
          {invoiceCurrency?.symbol}
        </Label>
      </div>
      {/* amountPaid */}
      <div className="w-3/12">
        <Label className="font-thin">{tInvoicing('invoice.attributes.payment')}</Label>
        <Input type="number" onChange={handleAmountPaidChange} value={invoiceEntry.amount || 0} />
      </div>
      {/* convertionRate */}
      <div className="w-2/12">
        <Label className="font-thin">{tInvoicing('invoice.attributes.convertion_rate')}</Label>
        <Input
          type="number"
          disabled={invoiceCurrency?.code === currency?.code}
          onChange={handleConvertionRateChange}
          value={invoiceEntry.convertionRate || 1}
        />
      </div>
      {/* remainingAmount */}
      <div className="w-3/12 flex flex-col gap-2 items-center">
        <Label className="font-thin block">
          {tInvoicing('invoice.attributes.remaining_amount')}
        </Label>
        <Label>
          {currentRemainingAmount.toFixed(invoiceCurrency?.digitAfterComma || 3)}
          {invoiceCurrency?.symbol}
        </Label>
      </div>
    </div>
  );
};

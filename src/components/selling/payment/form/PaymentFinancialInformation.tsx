import React from 'react';
import { Currency, Tax } from '@/types';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { useTranslation } from 'react-i18next';
import { usePaymentInvoiceManager } from '../hooks/usePaymentInvoiceManager';
import { usePaymentManager } from '../hooks/usePaymentManager';

interface PaymentFinancialInformationProps {
  className?: string;
  currency?: Currency;
  loading?: boolean;
}

export const PaymentFinancialInformation = ({
  className,
  currency,
  loading
}: PaymentFinancialInformationProps) => {
  const { t: tInvoicing } = useTranslation('invoicing');
  const paymentManager = usePaymentManager();
  const invoiceManager = usePaymentInvoiceManager();

  const currencySymbol = currency?.symbol || '$';
  const digitAfterComma = currency?.digitAfterComma || 3;

  const available = React.useMemo(() => {
    return (paymentManager.amount ?? 0) - (paymentManager.fee ?? 0);
  }, [paymentManager.amount, paymentManager.fee]);

  const used = React.useMemo(() => {
    return invoiceManager.calculateUsedAmount();
  }, [invoiceManager.invoices]);

  const remaining_amount = React.useMemo(() => {
    return available - used;
  }, [available, used]);

  return (
    <div className={cn(className)}>
      <div className="flex flex-col w-full">
        <div className="flex my-2">
          <Label className="mr-auto">{tInvoicing('payment.financial_status.received')}</Label>
          <Label className="ml-auto" isPending={loading || false}>
            {available?.toFixed(digitAfterComma)}
            {currencySymbol}
          </Label>
        </div>
      </div>
      <div className="flex flex-col w-full mt-1">
        <div className="flex my-2">
          <Label className="mr-auto">{tInvoicing('payment.financial_status.used')}</Label>
          <Label className="ml-auto" isPending={loading || false}>
            {used?.toFixed(digitAfterComma)} {currencySymbol}
          </Label>
        </div>
      </div>
      <div className="flex flex-col w-full border-t pt-1">
        <div className="flex my-2">
          <Label className="mr-auto">{tInvoicing('payment.financial_status.available')}</Label>
          <Label className="ml-auto" isPending={loading || false}>
            {remaining_amount?.toFixed(digitAfterComma)} {currencySymbol}
          </Label>
        </div>
      </div>
    </div>
  );
};

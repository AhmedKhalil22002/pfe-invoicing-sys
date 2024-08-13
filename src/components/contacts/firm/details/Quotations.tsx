import React from 'react';
import { QuotationMain } from '@/components/selling/quotation/QuotationMain';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

interface OverviewProps {
  className?: string;
  firmId: number;
}

export const Quotations: React.FC<OverviewProps> = ({ className, firmId }) => {
  const { t } = useTranslation('contacts');
  return (
    <div className={cn('p-10', className)}>
      <QuotationMain firmId={+firmId} />
    </div>
  );
};

import React from 'react';
import { QuotationMain } from '@/components/selling/quotation/QuotationMain';

interface QuotationsProps {
  className?: string;
  firmId: number;
}

export const Quotations: React.FC<QuotationsProps> = ({ className, firmId }) => {
  return (
    <div className={className}>
      <QuotationMain firmId={firmId} className="p-5 my-10 mx-5" />
    </div>
  );
};

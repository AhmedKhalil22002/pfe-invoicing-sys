import React from 'react';
import { InvoiceMain } from '@/components/selling/invoice/InvoiceMain';

interface InvoicesProps {
  className?: string;
  firmId: number;
}

export const Invoices: React.FC<InvoicesProps> = ({ className, firmId }) => {
  return (
    <div className={className}>
      <InvoiceMain firmId={firmId} className="p-5 my-10 mx-5" />
    </div>
  );
};

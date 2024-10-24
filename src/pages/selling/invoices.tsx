import React from 'react';
import { InvoiceMain } from '@/components/selling/invoice/InvoiceMain';

export default function InvoicesPage() {
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <InvoiceMain className="p-5 my-10" />
    </div>
  );
}

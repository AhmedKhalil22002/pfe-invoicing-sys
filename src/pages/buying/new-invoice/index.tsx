import React from 'react';
import { PurchaseInvoiceCreateForm } from '@/components/buying/purchase-invoice/PurchaseInvoiceCreateForm';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const params = useSearchParams();
  const firmId = params.get('firmId') || undefined;
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PurchaseInvoiceCreateForm firmId={firmId} />
    </div>
  );
}

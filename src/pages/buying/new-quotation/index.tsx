import React from 'react';
import { PurchaseQuotationCreateForm } from '@/components/buying/purchase-quotation/PurchaseQuotationCreateForm';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const params = useSearchParams();
  const firmId = params.get('firmId') || undefined;
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PurchaseQuotationCreateForm firmId={firmId} />
    </div>
  );
}

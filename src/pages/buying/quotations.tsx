import React from 'react';
import { PurchaseQuotationMain } from '@/components/buying/purchase-quotation/PurchaseQuotationMain';

export default function PurchaseQuotationsPage() {
  return (
    <div className="flex-1 flex flex-col overflow-auto p-8">
      <PurchaseQuotationMain className="p-5 my-10" />
    </div>
  );
}

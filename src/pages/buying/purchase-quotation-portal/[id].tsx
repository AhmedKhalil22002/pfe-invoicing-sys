import React from 'react';
import { PurchaseQuotationUpdateForm } from '@/components/buying/purchase-quotation/PurchaseQuotationUpdateForm';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PurchaseQuotationUpdateForm purchaseQuotationId={id} />
    </div>
  );
}

import React from 'react';
import { useRouter } from 'next/router';
import { PurchaseInvoiceUpdateForm } from '@/components/buying/purchase-invoice/PurchaseInvoiceUpdateForm';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PurchaseInvoiceUpdateForm purchaseInvoiceId={id} />
    </div>
  );
}

import React from 'react';
import { useRouter } from 'next/router';
import { InvoiceCreateForm } from '@/components/selling/invoice/InvoiceCreateForm';

export default function NewInvoicePage() {
  const router = useRouter();
  const firmId = router.query.id as string;
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <InvoiceCreateForm firmId={firmId} />
    </div>
  );
}

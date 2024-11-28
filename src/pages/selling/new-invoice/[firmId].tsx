import React from 'react';
import { useRouter } from 'next/router';
import { InvoiceCreateForm } from '@/components/selling/invoice/InvoiceCreateForm';

export default function Page() {
  const router = useRouter();
  const firmId = router.query.firmId as string;
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <InvoiceCreateForm firmId={firmId} />
    </div>
  );
}

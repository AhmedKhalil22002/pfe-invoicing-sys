import React from 'react';
import { useRouter } from 'next/router';
import { InvoiceUpdateForm } from '@/components/selling/invoice/InvoiceUpdateForm';
import { Page404 } from '@/components/common';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  if (!id) return <Page404 />;
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <InvoiceUpdateForm invoiceId={id} />
    </div>
  );
}

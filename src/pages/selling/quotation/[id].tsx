import React from 'react';
import { QuotationUpdateForm } from '@/components/selling/quotation/QuotationUpdateForm';
import { useRouter } from 'next/router';
import { Page404 } from '@/components/common';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  if (!id) return <Page404 />;
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <QuotationUpdateForm quotationId={id} />
    </div>
  );
}

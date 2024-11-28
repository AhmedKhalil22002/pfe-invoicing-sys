import React from 'react';
import { QuotationCreateForm } from '@/components/selling/quotation/QuotationCreateForm';
import { useRouter } from 'next/router';

export default function Page() {
  const router = useRouter();
  const firmId = router.query.firmId as string;
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <QuotationCreateForm firmId={firmId} />
    </div>
  );
}

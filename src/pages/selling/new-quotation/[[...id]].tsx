import React from 'react';
import { QuotationCreateForm } from '@/components/selling/quotation/QuotationCreateForm';
import { useRouter } from 'next/router';

export default function NewQuotationPage() {
  const router = useRouter();
  const firmId = router.query.id as string;
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <QuotationCreateForm firmId={firmId} />
    </div>
  );
}

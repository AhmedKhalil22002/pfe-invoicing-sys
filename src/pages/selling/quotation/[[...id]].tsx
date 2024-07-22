import React from 'react';
import { Container, Page404 } from '@/components/common';
import { QuotationUpdateForm } from '@/components/selling/quotation/QuotationUpdateForm';
import { useRouter } from 'next/router';

export default function QuotationDetailsPage() {
  const router = useRouter();
  const id = router.query.id as string;
  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <QuotationUpdateForm quotationId={id} />
      </div>
    </Container>
  );
}

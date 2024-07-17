import React from 'react';
import { Container, Page404 } from '@/components/common';
import { useSearchParams } from 'next/navigation';
import { QuotationUpdateForm } from '@/components/selling/quotation/QuotationUpdateForm';

export default function QuotationDetailsPage() {
  const params = useSearchParams();
  const id = params.get('id');
  if (!id) return null;

  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <QuotationUpdateForm quotationId={id} />
      </div>
    </Container>
  );
}

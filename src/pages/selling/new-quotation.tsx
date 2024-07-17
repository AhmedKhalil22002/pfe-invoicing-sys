import React from 'react';
import { Container } from '@/components/common';
import { QuotationCreateForm } from '@/components/selling/quotation/QuotationCreateForm';

export default function NewQuotationPage() {
  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <QuotationCreateForm />
      </div>
    </Container>
  );
}

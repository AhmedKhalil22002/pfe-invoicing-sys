import React from 'react';
import { Container } from '@/components/common';
import { QuotationMain } from '@/components/selling/quotation/QuotationMain';

export default function QuotationsPage() {
  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <QuotationMain />
      </div>
    </Container>
  );
}

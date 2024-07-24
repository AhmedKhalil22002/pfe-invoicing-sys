import React from 'react';
import { Container } from '@/components/common';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function InvoicesPage() {
  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <ComingSoon />
      </div>
    </Container>
  );
}

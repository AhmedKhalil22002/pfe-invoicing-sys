import React from 'react';
import { Container } from '@/components/common';
import { FirmMain } from '@/components/contacts/firm';

export default function FirmPage() {
  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <FirmMain className="px-10 pt-8" />
      </div>
    </Container>
  );
}

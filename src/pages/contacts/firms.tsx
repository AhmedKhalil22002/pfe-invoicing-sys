import React from 'react';
import { Container } from '@/components/common';
import { FirmMain } from '@/components/contacts/firm/FirmMain';

export default function FirmPage() {
  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-auto p-8">
        <FirmMain className="p-5 my-10" />
      </div>
    </Container>
  );
}

import React from 'react';
import { Container } from '@/components/common';
import { FirmCreateForm } from '@/components/contacts/firm';

export default function NewFirmPage() {
  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <FirmCreateForm />
      </div>
    </Container>
  );
}

import React from 'react';
import { Container } from '@/components/common';
import { FirmMain } from '@/components/contacts/firm';
import { ComingSoon } from '@/components/common/ComingSoon';

export default function InterlocutorPage() {
  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <ComingSoon />
      </div>
    </Container>
  );
}

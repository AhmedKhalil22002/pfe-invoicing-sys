import React from 'react';
import { Container } from '@/components/common';
import { FirmMain } from '@/components/contacts/firm';
import { ComingSoon } from '@/components/common/ComingSoon';
import { InterlocutorMain } from '@/components/contacts/interlocutor/InterlocutorMain';

export default function InterlocutorPage() {
  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <InterlocutorMain />
      </div>
    </Container>
  );
}

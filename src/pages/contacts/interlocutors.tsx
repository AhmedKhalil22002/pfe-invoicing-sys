import React from 'react';
import { Container } from '@/components/common';
import { InterlocutorMain } from '@/components/contacts/interlocutor/InterlocutorMain';

export default function InterlocutorPage() {
  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden p-8">
        <InterlocutorMain className="p-5 my-10" />
      </div>
    </Container>
  );
}

import React from 'react';
import { Container } from '@/components/common';
import { InterlocutorCreateForm } from '@/components/contacts/interlocutor/InterlocutorCreateForm';

export default function NewInterlocutorPage() {
  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <InterlocutorCreateForm />
      </div>
    </Container>
  );
}

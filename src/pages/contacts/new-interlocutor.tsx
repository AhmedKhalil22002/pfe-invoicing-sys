import React from 'react';
import { Container, Page404 } from '@/components/common';
import { InterlocutorCreateForm } from '@/components/contacts/interlocutor/InterlocutorCreateForm';
import { useSearchParams } from 'next/navigation';

export default function NewInterlocutorPage() {
  const params = useSearchParams();
  const id = params.get('id');
  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <InterlocutorCreateForm {...(id && { firmId: +id })} />
      </div>
    </Container>
  );
}

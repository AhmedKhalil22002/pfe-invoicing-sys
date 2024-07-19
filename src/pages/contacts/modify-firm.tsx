import React from 'react';
import { Container, Page404 } from '@/components/common';
import { FirmUpdateForm } from '@/components/contacts/firm';
import { useSearchParams } from 'next/navigation';

export default function ModifyFirmPage() {
  const params = useSearchParams();
  const id = params.get('id');
  if (!id) return <Page404 />;
  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <FirmUpdateForm firmId={+id} />
      </div>
    </Container>
  );
}

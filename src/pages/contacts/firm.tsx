import React from 'react';
import { Container, Page404 } from '@/components/common';
import { FirmDetails } from '@/components/contacts/firm';
import { useSearchParams } from 'next/navigation';

export default function FirmDetailsPage() {
  const params = useSearchParams();
  const id = params.get('id');
  if (!id) return <Page404 />;

  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <FirmDetails firmId={id} />
      </div>
    </Container>
  );
}

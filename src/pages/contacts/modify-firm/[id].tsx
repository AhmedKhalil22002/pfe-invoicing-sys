import React from 'react';
import { Container, Page404 } from '@/components/common';
import { FirmUpdateForm } from '@/components/contacts/firm';
import { useSearchParams } from 'next/navigation';
import { useRouter } from 'next/router';

export default function ModifyFirmPage() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        <FirmUpdateForm firmId={+id} />
      </div>
    </Container>
  );
}

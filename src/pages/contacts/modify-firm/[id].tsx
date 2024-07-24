import React from 'react';
import { Container } from '@/components/common';
import { FirmUpdateForm } from '@/components/contacts/firm';
import { useRouter } from 'next/router';

export default function ModifyFirmPage() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {id && <FirmUpdateForm firmId={+id} />}
      </div>
    </Container>
  );
}

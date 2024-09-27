import React from 'react';
import { Container } from '@/components/common';
import { useRouter } from 'next/router';
import { FirmUpdateForm } from '@/components/contacts/firm/FirmUpdateForm';

export default function ModifyFirmPage() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <Container className="flex-1 flex flex-col overflow-hidden">
      <div className="flex-1 flex flex-col overflow-hidden">
        {id && <FirmUpdateForm className="px-10 pt-8" firmId={+id} isNested={false} />}
      </div>
    </Container>
  );
}

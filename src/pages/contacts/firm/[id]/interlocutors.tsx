import React from 'react';
import { Page404 } from '@/components/common';
import { useRouter } from 'next/router';
import { FirmDetails } from '@/components/contacts/firm/FirmDetails';
import { InterlocutorMain } from '@/components/contacts/interlocutor/InterlocutorMain';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  return (
    <FirmDetails firmId={id}>
      <InterlocutorMain firmId={parseInt(id)} />
    </FirmDetails>
  );
}

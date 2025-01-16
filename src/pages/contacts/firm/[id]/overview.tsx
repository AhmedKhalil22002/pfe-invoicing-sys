import React from 'react';
import { useRouter } from 'next/router';
import { FirmDetails } from '@/components/contacts/firm/FirmDetails';
import { FirmUpdateForm } from '@/components/contacts/firm/FirmUpdateForm';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;

  return <FirmDetails firmId={id}></FirmDetails>;
}

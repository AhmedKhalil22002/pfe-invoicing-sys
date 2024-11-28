import React from 'react';
import { Page404 } from '@/components/common';
import { useRouter } from 'next/router';
import { InterlocutorDetails } from '@/components/contacts/interlocutor/InterlocutorDetails';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  if (!id) return <Page404 />;
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <InterlocutorDetails interlocutorId={id} />
    </div>
  );
}

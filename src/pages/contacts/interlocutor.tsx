import React from 'react';
import { Page404 } from '@/components/common';
import { useSearchParams } from 'next/navigation';
import { InterlocutorDetails } from '@/components/contacts/interlocutor/InterlocutorDetails';

export default function InterlocutorDetailsPage() {
  const params = useSearchParams();
  const id = params.get('id');
  if (!id) return <Page404 />;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <InterlocutorDetails interlocutorId={id} />
    </div>
  );
}

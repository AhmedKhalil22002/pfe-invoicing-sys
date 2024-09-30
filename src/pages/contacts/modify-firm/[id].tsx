import React from 'react';
import { useRouter } from 'next/router';
import { FirmUpdateForm } from '@/components/contacts/firm/FirmUpdateForm';

export default function ModifyFirmPage() {
  const router = useRouter();
  const id = router.query.id as string;

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {id && <FirmUpdateForm className="px-10 pt-8" firmId={parseInt(id)} isNested={false} />}
    </div>
  );
}

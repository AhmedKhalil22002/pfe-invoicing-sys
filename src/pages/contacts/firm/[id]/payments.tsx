import React from 'react';
import { Page404 } from '@/components/common';
import { useRouter } from 'next/router';
import { FirmDetails } from '@/components/contacts/firm/FirmDetails';
import { PaymentMain } from '@/components/selling/payment/PaymentMain';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  if (!id) return <Page404 />;
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <FirmDetails firmId={id} defaultValue="payments" />
      <PaymentMain firmId={parseInt(id)} className="m-10 p-5" />
    </div>
  );
}

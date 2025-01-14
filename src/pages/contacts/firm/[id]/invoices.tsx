import React from 'react';
import { Page404 } from '@/components/common';
import { useRouter } from 'next/router';
import { FirmDetails } from '@/components/contacts/firm/FirmDetails';
import { InvoiceMain } from '@/components/selling/invoice/InvoiceMain';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  return (
    <FirmDetails firmId={id}>
      <InvoiceMain firmId={parseInt(id)} />
    </FirmDetails>
  );
}

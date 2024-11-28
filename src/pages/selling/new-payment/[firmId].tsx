import React from 'react';
import { useRouter } from 'next/router';
import { PaymentCreateForm } from '@/components/selling/payment/PaymentCreateForm';

export default function Page() {
  const router = useRouter();
  const firmId = router.query.firmId as string;
  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      <PaymentCreateForm firmId={firmId} />
    </div>
  );
}

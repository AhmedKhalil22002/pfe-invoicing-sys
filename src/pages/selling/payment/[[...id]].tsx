import React from 'react';
import { useRouter } from 'next/router';
import { PaymentUpdateForm } from '@/components/selling/payment/PaymentUpdateForm';

export default function Page() {
  const router = useRouter();
  const id = router.query.id as string;
  if (id)
    return (
      <div className="flex-1 flex flex-col overflow-hidden">
        <PaymentUpdateForm paymentId={id} />
      </div>
    );
}

import React from 'react';
import { SystemSettings } from '@/components/settings/SystemSettings';
import PaymentConditionMain from '@/components/settings/PaymentCondition/PaymentConditionMain';

export default function page() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <SystemSettings defaultValue={'payment-conditions'} />
      <PaymentConditionMain className="m-10" />
    </div>
  );
}

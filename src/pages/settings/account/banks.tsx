import React from 'react';
import { InformationalSettings } from '@/components/settings/InformationalSettings';
import { BankAccountMain } from '@/components/settings/BankAccount/BankAccountMain';

export default function Page() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <InformationalSettings defaultValue={'banks'} />
      <BankAccountMain className="m-10" />
    </div>
  );
}

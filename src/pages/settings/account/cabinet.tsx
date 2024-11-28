import React from 'react';
import { InformationalSettings } from '@/components/settings/InformationalSettings';
import CabinetMain from '@/components/settings/Cabinet/CabinetMain';

export default function Page() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <InformationalSettings defaultValue={'cabinet'} />
      <CabinetMain className="m-10" />
    </div>
  );
}

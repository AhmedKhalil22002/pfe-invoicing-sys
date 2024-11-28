import React from 'react';
import { SystemSettings } from '@/components/settings/SystemSettings';
import { SequentialMain } from '@/components/settings/Sequentials/SequentialMain';

export default function Page() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <SystemSettings defaultValue={'sequence'} />
      <SequentialMain className="m-10" />
    </div>
  );
}

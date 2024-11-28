import React from 'react';
import { SystemSettings } from '@/components/settings/SystemSettings';
import TaxMain from '@/components/settings/Tax/TaxMain';

export default function page() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <SystemSettings defaultValue={'tax'} />
      <TaxMain className="m-10" />
    </div>
  );
}

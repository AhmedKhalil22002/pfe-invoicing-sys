import React from 'react';
import { SystemSettings } from '@/components/settings/SystemSettings';
import TaxWithholdingMain from '@/components/settings/TaxWithholding/TaxWithholdingMain';

export default function page() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <SystemSettings defaultValue={'withholding'} />
      <TaxWithholdingMain className="m-10" />
    </div>
  );
}

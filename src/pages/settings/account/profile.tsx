import React from 'react';
import { ComingSoon } from '@/components/common';
import { InformationalSettings } from '@/components/settings/InformationalSettings';

export default function page() {
  return (
    <div>
      <InformationalSettings defaultValue={'profile'} />
      <ComingSoon />
    </div>
  );
}

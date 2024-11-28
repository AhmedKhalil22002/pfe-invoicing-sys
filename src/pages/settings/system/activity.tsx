import React from 'react';
import { SystemSettings } from '@/components/settings/SystemSettings';
import ActivityMain from '@/components/settings/Activity/ActivityMain';

export default function page() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <SystemSettings defaultValue={'activity'} />
      <ActivityMain className="m-10" />
    </div>
  );
}

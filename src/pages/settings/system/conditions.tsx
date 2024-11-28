import React from 'react';
import { SystemSettings } from '@/components/settings/SystemSettings';
import { DefaultConditionMain } from '@/components/settings/DefaultCondition/DefaultConditionMain';

export default function page() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <SystemSettings defaultValue={'conditions'} />
      <DefaultConditionMain className="m-10" />
    </div>
  );
}

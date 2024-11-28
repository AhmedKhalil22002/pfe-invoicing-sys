import React from 'react';
import { FirmCreateForm } from '@/components/contacts/firm/FirmCreateForm';

export default function NewFirmPage() {
  return (
    <div className="flex-1 flex flex-col overflow-auto">
      <FirmCreateForm className="px-10 pt-8" />
    </div>
  );
}

import React from 'react';
import { Spinner } from '@/components/common';
import useFirmChoices from '@/hooks/content/useFirmChoice';
import { InterlocutorContactInformation, InterlocutorEntrepriseInformation } from './form';

interface InterlocutorFormProps {
  className?: string;
  firmId?: number;
}

export const InterlocutorForm: React.FC<InterlocutorFormProps> = ({ className, firmId }) => {
  const { firms, isFetchFirmsPending } = useFirmChoices(['interlocutorsToFirm', 'currency']);

  if (isFetchFirmsPending) return <Spinner className="h-screen" />;
  return (
    <div className={className}>
      <div className="flex flex-col">
        <InterlocutorContactInformation firmId={firmId} />
        {!firmId && <InterlocutorEntrepriseInformation firms={firms} />}
      </div>
    </div>
  );
};

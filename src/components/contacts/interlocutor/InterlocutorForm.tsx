import React from 'react';
import { InterlocutorContactInformation } from './form/InterlocutorContactInformation';

interface InterlocutorFormProps {
  className?: string;
  firmId?: number;
}

export const InterlocutorForm: React.FC<InterlocutorFormProps> = ({ className, firmId }) => {
  return (
    <div className={className}>
      <InterlocutorContactInformation className="my-4" />
    </div>
  );
};

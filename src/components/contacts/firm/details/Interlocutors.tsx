import React from 'react';
import { InterlocutorMain } from '../../interlocutor/InterlocutorMain';
import { useTranslation } from 'react-i18next';

interface OverviewProps {
  className?: string;
  firmId: number;
  mainInterlocutorId?: number;
}

export const Interlocutors: React.FC<OverviewProps> = ({
  className,
  firmId,
  mainInterlocutorId
}) => {
  const { t } = useTranslation('contacts');
  return (
    <div className={className}>
      <InterlocutorMain
        firmId={firmId}
        mainInterlocutorId={mainInterlocutorId}
        className="p-5 my-10 mx-5"
      />
    </div>
  );
};

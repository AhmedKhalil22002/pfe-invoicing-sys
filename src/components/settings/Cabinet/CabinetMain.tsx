import React from 'react';
import { GeneralInformations } from './GeneralInformations';
import { Button } from '@/components/ui/button';
import { AccountingInformations } from './AccountingInformation';

interface CabinetMainProps {
  className?: string;
}

const CabinetMain: React.FC<CabinetMainProps> = ({ className }) => {
  return (
    <div className={className}>
      <div className="flex justify-end">
        <Button className="ml-3">Enregistrer</Button>
        <Button variant="secondary" className="border-2 ml-3">
          Annuler
        </Button>
      </div>
      <GeneralInformations className="mt-5" />
      <AccountingInformations className="mt-5" />
    </div>
  );
};

export default CabinetMain;

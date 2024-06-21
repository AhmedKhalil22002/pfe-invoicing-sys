import React from 'react';
import { GeneralInformations } from './GeneralInformations';
import { Button } from '@/components/ui/button';
import { AccountingInformations } from './AccountingInformation';
import { useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { Cabinet } from '@/api/types/cabinet';

interface CabinetMainProps {
  className?: string;
}

const CabinetMain: React.FC<CabinetMainProps> = ({ className }) => {
  const {
    isPending,
    error,
    data: cabinetResp
    // refetch
  } = useQuery({
    queryKey: ['cabinet'],
    queryFn: () => api.cabinet.findOne()
  });

  const [cabinet, setCabinet] = React.useState<Cabinet>(cabinetResp || ({} as Cabinet));
  React.useEffect(() => {
    if (cabinetResp) {
      setCabinet(cabinetResp);
    }
  }, [cabinetResp]);

  const handleCabinetChange = (updatedCabinet: Partial<Cabinet>) => {
    setCabinet(prev => ({ ...prev, ...updatedCabinet }));
  };

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className={className}>
      <div className="flex justify-end">
        <Button className="ml-3">Enregistrer</Button>
        <Button variant="secondary" className="border-2 ml-3">
          Annuler
        </Button>
      </div>
      <GeneralInformations
        className="mt-5"
        cabinet={cabinet}
        isPending={isPending}
        onCabinetChange={handleCabinetChange}
      />
      <AccountingInformations
        className="mt-5"
        cabinet={cabinet}
        isPending={isPending}
        onCabinetChange={handleCabinetChange}
      />
    </div>
  );
};

export default CabinetMain;

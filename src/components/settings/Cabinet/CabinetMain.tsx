import React from 'react';
import { GeneralInformations } from './GeneralInformations';
import { Button } from '@/components/ui/button';
import { AccountingInformations } from './AccountingInformation';
import { useMutation, useQuery } from '@tanstack/react-query';
import { api } from '@/api';
import { Cabinet } from '@/api/types/cabinet';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/errors';

interface CabinetMainProps {
  className?: string;
}

const CabinetMain: React.FC<CabinetMainProps> = ({ className }) => {
  const {
    isPending,
    error,
    data: cabinetResp,
    refetch: refetchCabinet
  } = useQuery({
    queryKey: ['cabinet'],
    queryFn: () => api.cabinet.findOne()
  });

  const [cabinet, setCabinet] = React.useState<Cabinet>(cabinetResp || ({} as Cabinet));
  const [originalCabinet, setOriginalCabinet] = React.useState<Cabinet>(
    cabinetResp || ({} as Cabinet)
  );

  React.useEffect(() => {
    if (cabinetResp) {
      setCabinet(cabinetResp);
      setOriginalCabinet(cabinetResp);
    }
  }, [cabinetResp]);

  const handleCabinetChange = (updatedCabinet: Partial<Cabinet>) => {
    setCabinet((prev) => ({ ...prev, ...updatedCabinet }));
  };

  const { mutate: updateCabinet } = useMutation({
    mutationFn: (data: Cabinet) => api.cabinet.update(data),
    onSuccess: () => {
      toast.success('Cabinet modifiée avec succès', { position: 'bottom-right' });
      refetchCabinet();
    },
    onError: (error) => {
      toast.error(getErrorMessage(error, 'Erreur lors de la modification de du cabinet'), {
        position: 'bottom-right'
      });
    }
  });

  if (error) return 'An error has occurred: ' + error.message;

  return (
    <div className={className}>
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
      <div className="flex justify-end mt-5">
        <Button
          className="ml-3"
          onClick={() => {
            updateCabinet(cabinet);
          }}>
          Enregistrer
        </Button>
        <Button
          variant="secondary"
          className="border-2 ml-3"
          onClick={() => {
            setCabinet(originalCabinet);
          }}>
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default CabinetMain;

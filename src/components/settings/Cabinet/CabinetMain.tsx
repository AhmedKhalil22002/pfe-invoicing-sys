import React from 'react';
import { GeneralInformation } from './GeneralInformation';
import { Button } from '@/components/ui/button';
import { AccountingInformation } from './AccountingInformation';
import { useMutation } from '@tanstack/react-query';
import { api } from '@/api';
import { Cabinet } from '@/api/types/cabinet';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/errors';
import { Spinner } from '@/components/common';
import { cn } from '@/lib/utils';
import { useCabinetManager } from '@/hooks/functions/useCabinetManager';
import useCountry from '@/hooks/content/useCountry';
import useAddressInput from '@/hooks/functions/useAddressInput';
import useCabinet from '@/hooks/content/useCabinet';
import useCurrency from '@/hooks/content/useCurrency';
import useActivity from '@/hooks/content/useActivity';

interface CabinetMainProps {
  className?: string;
}

const CabinetMain: React.FC<CabinetMainProps> = ({ className }) => {
  const { cabinet, isFetchCabinetPending, error, refetchCabinet } = useCabinet();
  const { activities, isFetchActivitiesPending } = useActivity();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { countries, isFetchCountriesPending } = useCountry();

  const cabinetManager = useCabinetManager();
  const addressManager = useAddressInput(api.address.factory());

  const loadValues = () => {
    cabinetManager.set('id', cabinet?.id);
    cabinetManager.set('enterpriseName', cabinet?.enterpriseName);
    cabinetManager.set('phone', cabinet?.phone);
    cabinetManager.set('email', cabinet?.email);
    cabinet?.address && addressManager.setEntireAddress(cabinet?.address);
    cabinetManager.set('taxIdNumber', cabinet?.taxIdNumber);
    cabinetManager.set('activity', cabinet?.activity);
    cabinetManager.set('currency', cabinet?.currency);
  };

  React.useEffect(() => {
    loadValues();
  }, [cabinet]);

  const globalReset = () => {
    refetchCabinet();
    addressManager.setEntireAddress(api.address.factory());
    cabinetManager.reset();
    loadValues();
  };

  const handleSubmit = () => {
    const data = cabinetManager.mergeData(addressManager.address);
    const validation = api.cabinet.validate(data);
    if (validation.message)
      toast.error(validation.message, {
        position: validation.position || 'bottom-right'
      });
    else {
      updateCabinet(data);
    }
  };

  const { mutate: updateCabinet, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: Cabinet) => api.cabinet.update(data),
    onSuccess: () => {
      toast.success('Cabinet modifiée avec succès', { position: 'bottom-right' });
      refetchCabinet();
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, 'Erreur lors de la modification de du cabinet'), {
        position: 'bottom-right'
      });
    }
  });

  const loading =
    isFetchCabinetPending ||
    isFetchCurrenciesPending ||
    isFetchActivitiesPending ||
    isFetchCountriesPending ||
    isUpdatePending;

  if (error) return 'An error has occurred: ' + error.message;
  if (loading) return <Spinner className="h-screen" show={loading} />;
  return (
    <div className={cn(className)}>
      <GeneralInformation
        addressManager={addressManager}
        countries={countries}
        isPending={isUpdatePending}
      />
      <AccountingInformation
        className="mt-5"
        isPending={isUpdatePending}
        activities={activities}
        currencies={currencies}
      />
      <div className="flex justify-end mt-5">
        <Button className="ml-3" onClick={handleSubmit}>
          Enregistrer
          <Spinner className="ml-2" size={'small'} show={isUpdatePending} />
        </Button>
        <Button variant="secondary" className="border-2 ml-3" onClick={globalReset}>
          Annuler
        </Button>
      </div>
    </div>
  );
};

export default CabinetMain;

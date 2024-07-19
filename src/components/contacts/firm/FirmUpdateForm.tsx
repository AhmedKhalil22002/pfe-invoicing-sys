import React from 'react';
import useCurrency from '@/hooks/content/useCurrency';
import useActivity from '@/hooks/content/useActivity';
import useCountry from '@/hooks/content/useCountry';
import { Button } from '../../ui/button';
import { Spinner } from '../../common';
import usePaymentCondition from '@/hooks/content/usePaymentCondition';
import FirmGeneralInformation from './form/FirmGeneralInformation';
import FirmProfessionalInformation from './form/FirmProfessionalInformation';
import FirmAddressInformation from './form/FirmAddressInformation';
import FirmNotesInformation from './form/FirmNotesInformation';
import { Package, ReceiptText } from 'lucide-react';
import { AddressType, UpdateFirmDto, api } from '@/api';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { BreadcrumbCommon } from '@/components/common/Breadcrumb';
import { useFirmManager } from '@/hooks/functions/useFirmManager';
import useAddressInput from '@/hooks/functions/useAddressInput';

interface FirmFormProps {
  className?: string;
  firmId: number;
  isNested?: boolean;
}

export const FirmUpdateForm = ({ className, firmId, isNested }: FirmFormProps) => {
  const router = useRouter();

  const {
    isPending: isFetchPending,
    error,
    data: firmResp,
    refetch: refetchFirm
  } = useQuery({
    queryKey: ['firm', firmId],
    queryFn: () => api.firm.findOne(+firmId)
  });

  const firm = React.useMemo(() => {
    if (!firmResp) return null;
    return firmResp;
  }, [firmResp]);

  //form managers hooks
  const firmManager = useFirmManager();
  const deliveryAddressManager = useAddressInput(api.address.factory());
  const invoicingAddressManager = useAddressInput(api.address.factory());

  const loadValues = () => {
    firmManager.set('id', firm?.id);
    firmManager.set('enterpriseName', firm?.name);
    firmManager.set('website', firm?.website);
    firmManager.set('name', firm?.mainInterlocutor?.name);
    firmManager.set('surname', firm?.mainInterlocutor?.surname);
    firmManager.set('phone', firm?.mainInterlocutor?.phone);
    firmManager.set('email', firm?.mainInterlocutor?.email);

    firmManager.set('isPerson', firm?.isPerson);
    firmManager.set('taxIdNumber', firm?.taxIdNumber);
    firmManager.set('activity', firm?.activity);
    firmManager.set('currency', firm?.currency);
    firmManager.set('paymentCondition', firm?.paymentCondition);
    firmManager.set('notes', firm?.notes);

    invoicingAddressManager.setEntireAddress(firm?.invoicingAddress);
    deliveryAddressManager.setEntireAddress(firm?.deliveryAddress);
  };

  React.useEffect(() => {
    loadValues();
  }, [firm]);

  const { activities, isFetchActivitiesPending } = useActivity();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { countries, isFetchCountriesPending } = useCountry();
  const { paymentConditions, isFetchPaymentConditionsPending } = usePaymentCondition();
  const [oneAddress, setOneAddress] = React.useState<AddressType>('');

  const { mutate: updateFirm, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: UpdateFirmDto) => api.firm.update(data),
    onSuccess: () => {
      if (!isNested) router.push(`/contacts/firms`);
      toast.success('Entreprise modifié avec succès', { position: 'bottom-right' });
      refetchFirm();
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Erreur lors de la modification de l'entreprise");
      toast.error(message, {
        position: 'bottom-right'
      });
    }
  });

  const globalReset = () => {
    refetchFirm();
    invoicingAddressManager.setEntireAddress(api.address.factory());
    deliveryAddressManager.setEntireAddress(api.address.factory());
    firmManager.reset();
    setOneAddress('');
    loadValues();
  };

  const handleSubmit = () => {
    const data: UpdateFirmDto = firmManager.mergeData(
      oneAddress === 'deliveryAddress'
        ? deliveryAddressManager?.address
        : invoicingAddressManager?.address,
      oneAddress === 'invoicingAddress'
        ? invoicingAddressManager.address
        : deliveryAddressManager.address,
      firm?.id
    );
    const validation = api.firm.validate(data, oneAddress);
    if (validation.message)
      toast.error(validation.message, {
        position: validation.position || 'bottom-right'
      });
    else {
      updateFirm(data);
      globalReset();
    }
  };

  const handleCopyAddress = (prefix: AddressType) => {
    setOneAddress(oneAddress === prefix ? '' : prefix);
  };

  const loading =
    isFetchActivitiesPending ||
    isFetchCurrenciesPending ||
    isFetchCountriesPending ||
    isFetchPaymentConditionsPending ||
    isFetchPending ||
    isUpdatePending;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className={cn('overflow-auto p-8', className)}>
      {!isNested && (
        <BreadcrumbCommon
          hierarchy={[
            { title: 'Contacts', href: '/contacts' },
            { title: 'Entreprises', href: '/contacts/firms' },
            { title: 'Modifier Entreprise' }
          ]}
        />
      )}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <FirmGeneralInformation />

        <FirmProfessionalInformation
          activities={activities}
          currencies={currencies}
          paymentConditions={paymentConditions}
          loading={loading}
        />

        <FirmAddressInformation
          addressManager={invoicingAddressManager}
          icon={<ReceiptText className="h-7 w-7 mr-1" />}
          addressLabel="Adresse de Facturation"
          countries={countries}
          handleCopyAddress={() => handleCopyAddress('invoicingAddress')}
          disabled={oneAddress === 'deliveryAddress'}
          loading={loading}
        />
        <FirmAddressInformation
          addressManager={deliveryAddressManager}
          icon={<Package className="h-7 w-7 mr-1" />}
          addressLabel="Adresse de Livraison"
          countries={countries}
          handleCopyAddress={() => handleCopyAddress('deliveryAddress')}
          disabled={oneAddress === 'invoicingAddress'}
          loading={loading}
        />
      </div>

      <FirmNotesInformation className="mt-5" loading={loading} />

      <div className="flex my-5">
        <Button className="ml-3" onClick={handleSubmit}>
          Enregistrer <Spinner className="ml-2" size={'small'} show={isUpdatePending} />
        </Button>
        <Button variant="secondary" className="border-2 ml-3" onClick={globalReset}>
          Annuler
        </Button>
      </div>
    </div>
  );
};

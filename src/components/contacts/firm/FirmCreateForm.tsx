import React from 'react';
import useCurrency from '@/hooks/content/useCurrency';
import useActivity from '@/hooks/content/useActivity';
import useCountry from '@/hooks/content/useCountry';
import { Button } from '../../ui/button';
import { BreadcrumbCommon, Spinner } from '@/components/common';
import usePaymentCondition from '@/hooks/content/usePaymentCondition';
import { Package, ReceiptText } from 'lucide-react';
import { AddressType, CreateFirmDto, api } from '@/api';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { useFirmManager } from '@/hooks/functions/useFirmManager';
import useAddressInput from '@/hooks/functions/useAddressInput';
import FirmProfessionalInformation from './form/FirmProfessionalInformation';
import FirmGeneralInformation from './form/FirmGeneralInformation';
import FirmAddressInformation from './form/FirmAddressInformation';
import FirmNotesInformation from './form/FirmNotesInformation';

interface FirmFormProps {
  className?: string;
}

export const FirmCreateForm = ({ className }: FirmFormProps) => {
  const router = useRouter();

  // Fetch options
  const { activities, isFetchActivitiesPending } = useActivity();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { countries, isFetchCountriesPending } = useCountry();
  const { paymentConditions, isFetchPaymentConditionsPending } = usePaymentCondition();
  const [oneAddress, setOneAddress] = React.useState<AddressType>('');

  //form managers hooks
  const firmManager = useFirmManager();
  const deliveryAddressManager = useAddressInput(api.address.factory());
  const invoicingAddressManager = useAddressInput(api.address.factory());

  const { mutate: createFirm, isPending: isCreatePending } = useMutation({
    mutationFn: (data: CreateFirmDto) => api.firm.create(data),
    onSuccess: () => {
      router.push(`/contacts/firms`);
      toast.success('Entreprise ajoutée avec succès', { position: 'bottom-right' });
    },
    onError: (error) => {
      const message = getErrorMessage(error, "Erreur lors de la création de l'entreprise");
      toast.error(message, {
        position: 'bottom-right'
      });
    }
  });

  const globalReset = () => {
    invoicingAddressManager.setEntireAddress(api.address.factory());
    deliveryAddressManager.setEntireAddress(api.address.factory());
    firmManager.reset();
    setOneAddress('');
  };

  const handleSubmit = () => {
    const data: CreateFirmDto = firmManager.mergeData(
      oneAddress === 'deliveryAddress'
        ? deliveryAddressManager.address
        : invoicingAddressManager.address,
      oneAddress === 'invoicingAddress'
        ? invoicingAddressManager.address
        : deliveryAddressManager.address
    );
    console.log(data);
    const validation = api.firm.validate(data, oneAddress);
    if (validation.message)
      toast.error(validation.message, {
        position: validation.position || 'bottom-right'
      });
    else {
      createFirm(data);
    }
  };

  const handleCopyAddress = (prefix: AddressType) => {
    setOneAddress(oneAddress === prefix ? '' : prefix);
    if (prefix === 'deliveryAddress') {
      invoicingAddressManager.setEntireAddress(api.address.factory());
    } else {
      deliveryAddressManager.setEntireAddress(api.address.factory());
    }
  };

  if (
    isFetchActivitiesPending ||
    isFetchCurrenciesPending ||
    isFetchCountriesPending ||
    isFetchPaymentConditionsPending
  )
    return <Spinner className="h-screen" />;

  return (
    <div className={cn('overflow-auto p-8', className)}>
      <BreadcrumbCommon
        hierarchy={[
          { title: 'Contacts', href: '/contacts' },
          { title: 'Firmes', href: '/contacts/firms' },
          { title: 'Nouvelle Firm' }
        ]}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <FirmGeneralInformation />

        <FirmProfessionalInformation
          activities={activities}
          currencies={currencies}
          paymentConditions={paymentConditions}
        />

        <FirmAddressInformation
          addressManager={invoicingAddressManager}
          icon={<ReceiptText className="h-7 w-7 mr-1" />}
          addressLabel="Adresse de Facturation"
          countries={countries}
          handleCopyAddress={() => handleCopyAddress('invoicingAddress')}
          disabled={oneAddress === 'deliveryAddress'}
        />
        <FirmAddressInformation
          addressManager={deliveryAddressManager}
          icon={<Package className="h-7 w-7 mr-1" />}
          addressLabel="Adresse de Livraison"
          countries={countries}
          handleCopyAddress={() => handleCopyAddress('deliveryAddress')}
          disabled={oneAddress === 'invoicingAddress'}
        />
      </div>

      <FirmNotesInformation className="mt-5" />

      <div className="flex my-5">
        <Button className="ml-3" onClick={handleSubmit}>
          Enregistrer <Spinner className="ml-2" size={'small'} show={isCreatePending} />
        </Button>
        <Button variant="secondary" className="border-2 ml-3" onClick={globalReset}>
          Annuler
        </Button>
      </div>
    </div>
  );
};

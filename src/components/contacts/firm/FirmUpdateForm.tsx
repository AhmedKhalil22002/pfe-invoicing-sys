import React from 'react';
import useCurrency from '@/hooks/content/useCurrency';
import useActivity from '@/hooks/content/useActivity';
import useCountry from '@/hooks/content/useCountry';
import { Button } from '../../ui/button';
import { Spinner } from '../../common';
import usePaymentCondition from '@/hooks/content/usePaymentCondition';
import { Package, ReceiptText } from 'lucide-react';
import { Address, AddressType, UpdateFirmDto, api } from '@/api';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { BreadcrumbCommon } from '@/components/common/Breadcrumb';
import { useFirmManager } from '@/hooks/functions/useFirmManager';
import useAddressInput from '@/hooks/functions/useAddressInput';
import FirmContactInformation from './form/FirmContactInformation';
import FirmEntrepriseInformation from './form/FirmEntrepriseInformation';
import FirmAddressInformation from './form/FirmAddressInformation';
import FirmNotesInformation from './form/FirmNotesInformation';
import { useTranslation } from 'react-i18next';

interface FirmFormProps {
  className?: string;
  isNested?: boolean;
  firmId: number;
}

export const FirmUpdateForm = ({ className, isNested = true, firmId }: FirmFormProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tContacts } = useTranslation('contacts');

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
    const mainInterlocutorEntry = firm?.interlocutorsToFirm?.find(
      (interlocutor) => interlocutor.isMain
    );
    firmManager.set('enterpriseName', firm?.name);
    firmManager.set('website', firm?.website);
    firmManager.set('name', mainInterlocutorEntry?.interlocutor?.name);
    firmManager.set('surname', mainInterlocutorEntry?.interlocutor?.surname);
    firmManager.set('phone', mainInterlocutorEntry?.interlocutor?.phone);
    firmManager.set('email', mainInterlocutorEntry?.interlocutor?.email);
    firmManager.set('position', mainInterlocutorEntry?.position);

    firmManager.set('isPerson', firm?.isPerson);
    firmManager.set('taxIdNumber', firm?.taxIdNumber);
    firmManager.set('activity', firm?.activity);
    firmManager.set('currency', firm?.currency);
    firmManager.set('paymentCondition', firm?.paymentCondition);
    firmManager.set('notes', firm?.notes);

    invoicingAddressManager.setEntireAddress(firm?.invoicingAddress || ({} as Address));
    deliveryAddressManager.setEntireAddress(firm?.deliveryAddress || ({} as Address));
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
      if (!firmId) router.push(`/contacts/firms`);
      toast.success('Entreprise modifié avec succès', { position: 'bottom-right' });
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
    ) as UpdateFirmDto;
    const validation = api.firm.validate(data, oneAddress);
    if (validation.message)
      toast.error(validation.message, {
        position: validation.position || 'bottom-right'
      });
    else {
      updateFirm(data);
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
    isFetchPending;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className={cn('overflow-auto p-8', className)}>
      {!isNested && (
        <BreadcrumbCommon
          hierarchy={[
            { title: tCommon('menu.contacts'), href: '/contacts' },
            { title: tContacts('firm.plural'), href: '/contacts/firms' },
            {
              title: `${tContacts('firm.singular')} N°${firmId}`,
              href: '/contacts/firm?id=' + firmId
            }
          ]}
        />
      )}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <FirmContactInformation loading={loading} />

        <FirmEntrepriseInformation
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

      <div className="flex my-5 ml-auto">
        <Button onClick={handleSubmit}>
          {tCommon('commands.save')}
          <Spinner className="ml-2" size={'small'} show={isUpdatePending} />
        </Button>
        <Button variant="secondary" className="border-2 ml-3" onClick={globalReset}>
          {tCommon('commands.cancel')}
        </Button>
      </div>
    </div>
  );
};

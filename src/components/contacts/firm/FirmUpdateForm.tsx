import React from 'react';
import useCurrency from '@/hooks/content/useCurrency';
import useActivity from '@/hooks/content/useActivity';
import useCountry from '@/hooks/content/useCountry';
import { Button } from '../../ui/button';
import { Spinner } from '../../common';
import usePaymentCondition from '@/hooks/content/usePaymentCondition';
import { Package, ReceiptText } from 'lucide-react';
import { api } from '@/api';
import { Address, AddressType, Firm, UpdateFirmDto } from '@/types';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { BreadcrumbCommon } from '@/components/common/Breadcrumb';
import { useFirmManager } from '@/hooks/functions/useFirmManager';
import FirmContactInformation from './form/FirmContactInformation';
import FirmEntrepriseInformation from './form/FirmEntrepriseInformation';
import FirmAddressInformation from './form/FirmAddressInformation';
import FirmNotesInformation from './form/FirmNotesInformation';
import { useTranslation } from 'react-i18next';
import { AbstractCopyAddressHandler } from './utils/AbstractCopyAddressHandler';
import _ from 'lodash';

interface FirmFormProps {
  className?: string;
  isNested?: boolean;
  firmId: number;
}

export const FirmUpdateForm = ({ className, isNested = true, firmId }: FirmFormProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tContact } = useTranslation('contacts');

  const {
    isPending: isFetchPending,
    error,
    data: firmResp,
    refetch: refetchFirm
  } = useQuery({
    queryKey: ['firm', firmId],
    queryFn: () => api.firm.findOne(firmId)
  });

  const firm = React.useMemo(() => {
    return firmResp || null;
  }, [firmResp, firmId]);

  const { activities, isFetchActivitiesPending } = useActivity();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { countries, isFetchCountriesPending } = useCountry();
  const { paymentConditions, isFetchPaymentConditionsPending } = usePaymentCondition();

  //form managers hooks
  const firmManager = useFirmManager();

  const [initialData, setInitialData] = React.useState<any>();

  const loadValues = () => {
    if (!firm) return;
    firmManager.setFirm(firm as Firm);
    setInitialData(firmManager.getFirm());
    console.log(initialData);
  };

  React.useEffect(loadValues, [firmResp, firm]);

  const { mutate: updateFirm, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: UpdateFirmDto) => api.firm.update(data),
    onSuccess: () => {
      if (!firmId) router.push(`/contacts/firms`);
      toast.success('Entreprise modifié avec succès');
    },
    onError: (error) => {
      const message = getErrorMessage(
        'contacts',
        error,
        "Erreur lors de la modification de l'entreprise"
      );
      toast.error(message);
    }
  });

  const globalReset = () => {
    loadValues();
  };

  const onSubmit = () => {
    const data = firmManager.getFirm() as UpdateFirmDto;
    const validation = api.firm.validate(data);
    if (validation.message) toast.error(validation.message);
    else {
      updateFirm(data);
    }
  };

  //forward AbstractCopyAddressHandler
  const handleAddressCopy = (prefix: AddressType) =>
    AbstractCopyAddressHandler(
      tContact,
      prefix,
      firmManager.invoicingAddress,
      (a: Address) => firmManager.set('invoicingAddress', a),
      firmManager.deliveryAddress,
      (a: Address) => firmManager.set('deliveryAddress', a)
    );

  const loading =
    isFetchActivitiesPending ||
    isFetchCurrenciesPending ||
    isFetchCountriesPending ||
    isFetchPaymentConditionsPending ||
    isFetchPending;

  if (error) return 'An error has occurred: ' + error.message;
  return (
    <div className={cn('overflow-auto', className)}>
      {!isNested && (
        <BreadcrumbCommon
          hierarchy={[
            { title: tCommon('menu.contacts'), href: '/contacts' },
            { title: tContact('firm.plural'), href: '/contacts/firms' },
            {
              title: `${tContact('firm.singular')} N°${firmId}`,
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
          address={firmManager.invoicingAddress}
          setAddressField={(fieldName: string, value: any) => {
            firmManager.set('invoicingAddress', {
              ...firmManager.invoicingAddress,
              [fieldName]: value
            });
          }}
          icon={<ReceiptText className="h-7 w-7 mr-1" />}
          addressLabel="firm.attributes.invoicing_address"
          otherAddressLabel={'firm.attributes.delivery_address'}
          countries={countries}
          handleCopyAddress={() => handleAddressCopy('invoicingAddress')}
          loading={loading}
        />
        <FirmAddressInformation
          address={firmManager.deliveryAddress}
          setAddressField={(fieldName: string, value: any) => {
            firmManager.set('deliveryAddress', {
              ...firmManager.deliveryAddress,
              [fieldName]: value
            });
          }}
          icon={<Package className="h-7 w-7 mr-1" />}
          addressLabel="firm.attributes.delivery_address"
          otherAddressLabel={'firm.attributes.invoicing_address'}
          countries={countries}
          handleCopyAddress={() => handleAddressCopy('deliveryAddress')}
          loading={loading}
        />
      </div>

      <FirmNotesInformation className="mt-5" loading={loading} />

      <div className="flex my-5 ml-auto">
        <Button onClick={onSubmit} disabled={_.isEqual(initialData, firmManager.getFirm())}>
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

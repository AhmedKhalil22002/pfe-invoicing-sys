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
import FirmEntrepriseInformation from './form/FirmEntrepriseInformation';
import FirmContactInformation from './form/FirmContactInformation';
import FirmAddressInformation from './form/FirmAddressInformation';
import FirmNotesInformation from './form/FirmNotesInformation';
import { useTranslation } from 'react-i18next';
import { AbstractCopyAddressHandler } from './utils/AbstractCopyAddressHandler';

interface FirmFormProps {
  className?: string;
}

export const FirmCreateForm = ({ className }: FirmFormProps) => {
  const router = useRouter();
  const { t: tCommon, ready: tCommonReady } = useTranslation('common');
  const { t: tContact, ready: tContactReady } = useTranslation('contacts');

  React.useEffect(() => {
    globalReset();
  }, []);

  // Fetch options
  const { activities, isFetchActivitiesPending } = useActivity();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { countries, isFetchCountriesPending } = useCountry();
  const { paymentConditions, isFetchPaymentConditionsPending } = usePaymentCondition();

  //form managers hooks
  const firmManager = useFirmManager();
  const deliveryAddressManager = useAddressInput(api.address.factory());
  const invoicingAddressManager = useAddressInput(api.address.factory());

  const { mutate: createFirm, isPending: isCreatePending } = useMutation({
    mutationFn: (data: CreateFirmDto) => api.firm.create(data),
    onSuccess: () => {
      router.push(`/contacts/firms`);
      toast.success(tContact('firm.action_add_success'), { position: 'bottom-right' });
    },
    onError: (error): void => {
      const message = getErrorMessage('contacts', error, tContact('firm.action_add_failure'));
      toast.error(message, {
        position: 'bottom-right'
      });
    }
  });

  const globalReset = () => {
    invoicingAddressManager.setEntireAddress(api.address.factory());
    deliveryAddressManager.setEntireAddress(api.address.factory());
    firmManager.reset();
  };

  const handleSubmit = () => {
    const data: CreateFirmDto = firmManager.mergeData(
      deliveryAddressManager.address,
      invoicingAddressManager.address
    );
    const validation = api.firm.validate(data);
    if (validation.message)
      toast.error(tContact(validation.message), {
        position: validation.position || 'bottom-right'
      });
    else {
      createFirm(data);
    }
  };

  //forward AbstractCopyAddressHandler
  const handleAddressCopy = (prefix: AddressType) =>
    AbstractCopyAddressHandler(prefix, invoicingAddressManager, deliveryAddressManager, tContact);

  const loading =
    isFetchActivitiesPending ||
    isFetchCurrenciesPending ||
    isFetchCountriesPending ||
    isFetchPaymentConditionsPending ||
    !tCommonReady ||
    !tContactReady;
  if (loading) return <Spinner className="h-screen" show={loading} />;

  return (
    <div className={cn('overflow-auto p-8', className)}>
      <BreadcrumbCommon
        hierarchy={[
          { title: tCommon('menu.contacts'), href: '/contacts' },
          { title: tCommon('submenu.firms'), href: '/contacts/firms' },
          { title: tContact('firm.new') }
        ]}
      />

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <FirmContactInformation />

        <FirmEntrepriseInformation
          activities={activities}
          currencies={currencies}
          paymentConditions={paymentConditions}
        />

        <FirmAddressInformation
          addressManager={invoicingAddressManager}
          icon={<ReceiptText className="h-7 w-7 mr-1" />}
          addressLabel={'firm.attributes.invoicing_address'}
          countries={countries}
          handleCopyAddress={() => handleAddressCopy('invoicingAddress')}
        />
        <FirmAddressInformation
          addressManager={deliveryAddressManager}
          icon={<Package className="h-7 w-7 mr-1" />}
          addressLabel={'firm.attributes.delivery_address'}
          countries={countries}
          handleCopyAddress={() => handleAddressCopy('deliveryAddress')}
        />
      </div>

      <FirmNotesInformation className="mt-5" />

      <div className="flex flex-col gap-4">
        <div className="flex my-5 ml-auto">
          <Button className="ml-3" onClick={handleSubmit}>
            {tCommon('commands.save')}{' '}
            <Spinner className="ml-2" size={'small'} show={isCreatePending} />
          </Button>
          <Button variant="secondary" className="border-2 ml-3" onClick={globalReset}>
            {tCommon('commands.cancel')}
          </Button>
        </div>
      </div>
    </div>
  );
};

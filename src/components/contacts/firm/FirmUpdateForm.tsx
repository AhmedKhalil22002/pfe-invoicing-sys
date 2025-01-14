import React from 'react';
import useCurrency from '@/hooks/content/useCurrency';
import useActivity from '@/hooks/content/useActivity';
import useCountry from '@/hooks/content/useCountry';
import { Button } from '../../ui/button';
import { Spinner } from '../../common';
import usePaymentCondition from '@/hooks/content/usePaymentCondition';
import { Package, ReceiptText } from 'lucide-react';
import { api } from '@/api';
import { Address, AddressType, UpdateFirmDto } from '@/types';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { useFirmManager } from '@/components/contacts/firm/hooks/useFirmManager';
import FirmContactInformation from './form/FirmContactInformation';
import FirmEntrepriseInformation from './form/FirmEntrepriseInformation';
import FirmAddressInformation from './form/FirmAddressInformation';
import FirmNotesInformation from './form/FirmNotesInformation';
import { useTranslation } from 'react-i18next';
import { AbstractCopyAddressHandler } from './utils/AbstractCopyAddressHandler';
import { useBreadcrumb } from '@/components/layout/BreadcrumbContext';
import { useDebounce } from '@/hooks/other/useDebounce';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/common/PageHeader';
import { is } from 'date-fns/locale';

interface FirmFormProps {
  className?: string;
  isNested?: boolean;
  firmId?: number;
}

export const FirmUpdateForm = ({ className, isNested = false, firmId }: FirmFormProps) => {
  //next-router
  const router = useRouter();

  //translations
  const { t: tCommon } = useTranslation('common');
  const { t: tContact } = useTranslation('contacts');

  //stores
  const firmManager = useFirmManager();

  //Fetch options
  const {
    isFetching: isFetchPending,
    data: firmResp,
    refetch: refetchFirm
  } = useQuery({
    queryKey: ['firm', firmId],
    queryFn: () => api.firm.findOne(firmId)
  });

  const firm = React.useMemo(() => {
    return firmResp;
  }, [firmResp, firmId]);

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    if (firmId)
      setRoutes([
        { title: tCommon('menu.contacts'), href: '/contacts' },
        { title: tContact('firm.plural'), href: '/contacts/firms' },
        {
          title: `${tContact('firm.singular')} N°${firmId}`,
          href: '/contacts/firm?id=' + firmId
        }
      ]);
  }, [router.locale, firmId]);

  // Fetch options
  const { activities, isFetchActivitiesPending } = useActivity();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { countries, isFetchCountriesPending } = useCountry();
  const { paymentConditions, isFetchPaymentConditionsPending } = usePaymentCondition();
  const fetching =
    isFetchActivitiesPending ||
    isFetchCurrenciesPending ||
    isFetchCountriesPending ||
    isFetchPaymentConditionsPending ||
    isFetchPending;
  const { value: debounceFetching } = useDebounce<boolean>(fetching, 500);

  const globalReset = () => {
    firmManager.reset();
    firm && firmManager.setFirm(firm);
  };
  React.useEffect(globalReset, [firm]);

  //update firm mutator
  const { mutate: updateFirm, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: UpdateFirmDto) => api.firm.update(data),
    onSuccess: () => {
      if (!firmId) router.push(`/contacts/firms`);
      else refetchFirm();
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

  //update handler
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
      (a?: Address) => firmManager.set('invoicingAddress', a),
      firmManager.deliveryAddress,
      (a?: Address) => firmManager.set('deliveryAddress', a)
    );

  //component representation
  return (
    <div
      className={cn(
        'flex flex-col flex-1 overflow-hidden',
        !isNested && 'lg:mx-10 my-5',
        className
      )}>
      <PageHeader
        title={tContact('firm.edit_info', { firmName: firm?.name })}
        description={tContact('firm.edit_info_description', { firmName: firm?.name })}
        level={!isNested ? 'h1' : 'h3'}>
        <div className="flex my-2 h-12">
          <Button onClick={onSubmit} disabled={!firmManager.changed}>
            {tCommon('commands.save')}
            <Spinner className="ml-2" size={'small'} show={isUpdatePending} />
          </Button>
          <Button variant="secondary" className="border-2 ml-3" onClick={globalReset}>
            {tCommon('commands.cancel')}
          </Button>
        </div>
      </PageHeader>
      <div className="flex flex-col flex-1 overflow-auto pb-10 no-scrollbar">
        <div className="grid grid-cols-1 2xl:grid-cols-2 gap-4 mt-4">
          <FirmContactInformation loading={debounceFetching} />

          <FirmEntrepriseInformation
            activities={activities}
            currencies={currencies}
            paymentConditions={paymentConditions}
            loading={debounceFetching}
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
            loading={debounceFetching}
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
            loading={debounceFetching}
          />
        </div>

        <FirmNotesInformation className="mt-5" loading={debounceFetching} />
      </div>
    </div>
  );
};

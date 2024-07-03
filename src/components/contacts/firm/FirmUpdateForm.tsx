import React from 'react';
import useCurrency from '@/hooks/useCurrency';
import useActivity from '@/hooks/useActivity';
import useCountry from '@/hooks/useCountry';
import { Button } from '../../ui/button';
import { Spinner } from '../../common';
import usePaymentCondition from '@/hooks/usePaymentCondition';
import FirmGeneralInformations from './form/FirmGeneralInformations';
import FirmProfessionalInformations from './form/FirmProfessionalInformations';
import FirmAddressInformations from './form/FirmAddressInformations';
import FirmNotesInformations from './form/FirmNotesInformations';
import { Package, ReceiptText } from 'lucide-react';
import { AddressType, UpdateFirmDto, api } from '@/api';
import { Form, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { BreadcrumbCommon } from '@/components/common/Breadcrumb';

interface FirmFormProps {
  className?: string;
  firmId: string;
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const FirmUpdateForm = ({ className, firmId }: FirmFormProps) => {
  const router = useRouter();

  const {
    isPending: isFetchPending,
    error,
    data: firmResp
  } = useQuery({
    queryKey: ['firm', firmId],
    queryFn: () => api.firm.findOne(+firmId)
  });

  const firm = React.useMemo(() => {
    if (!firmResp) return null;
    return firmResp;
  }, [firmResp]);

  const { activities, isFetchActivitiesPending } = useActivity();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { countries, isFetchCountriesPending } = useCountry();
  const { paymentConditions, isFetchPaymentConditionsPending } = usePaymentCondition();
  const [oneAddress, setOneAddress] = React.useState<AddressType>('');

  const { register, control, handleSubmit, watch, reset } = useForm<UpdateFirmDto>({
    values: firm as UpdateFirmDto
  });

  const { mutate: createFirm, isPending: isUpdatePending } = useMutation({
    mutationFn: (data: UpdateFirmDto) => api.firm.create(data),
    onSuccess: () => {
      router.push(`/contacts/firms`);
      toast.success('Firm ajoutée avec succès', { position: 'bottom-right' });
    },
    onError: (error) => {
      const message = getErrorMessage(error, 'Erreur lors de la création du firm');
      toast.error(message, {
        position: 'bottom-right'
      });
    }
  });

  const onSubmit: SubmitHandler<UpdateFirmDto> = (data) => {
    // Handle form submission
    const validation = api.firm.validate(data, oneAddress);
    console.log(data);
    if (validation.message)
      toast.error(validation.message, {
        position: validation.position || 'bottom-right'
      });
    else {
      const firm = {
        ...data,
        invoicingAddress:
          oneAddress === 'deliveryAddress' ? data.deliveryAddress : data.invoicingAddress,
        deliveryAddress:
          oneAddress === 'invoicingAddress' ? data.invoicingAddress : data.deliveryAddress
      };
      createFirm(firm);
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
    <div className={cn('overflow-auto p-5', className)}>
      <BreadcrumbCommon
        hierarchy={[
          { title: 'Contacts', href: '/contacts' },
          { title: 'Firmes', href: '/contacts/firms' },
          { title: 'Modifier Firme' }
        ]}
      />
      <Form control={control}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <FirmGeneralInformations register={register} control={control} loading={loading} />

          <FirmProfessionalInformations
            register={register}
            control={control}
            activities={activities}
            currencies={currencies}
            watch={watch}
            paymentConditions={paymentConditions}
            loading={loading}
          />

          <FirmAddressInformations
            register={register}
            control={control}
            addressPrefix="invoicingAddress"
            icon={<ReceiptText className="h-5 w-5 mr-2" />}
            addressLabel="Adresse de Facturation"
            countries={countries}
            handleCopyAddress={() => handleCopyAddress('invoicingAddress')}
            watch={watch}
            disabled={oneAddress === 'deliveryAddress'}
            loading={loading}
          />
          <FirmAddressInformations
            register={register}
            control={control}
            addressPrefix="deliveryAddress"
            icon={<Package className="h-5 w-5 mr-2" />}
            addressLabel="Adresse de Livraison"
            countries={countries}
            handleCopyAddress={() => handleCopyAddress('deliveryAddress')}
            watch={watch}
            disabled={oneAddress === 'invoicingAddress'}
            loading={loading}
          />
        </div>

        <FirmNotesInformations className="mt-5" register={register} loading={loading} />

        <div className="flex my-5">
          <Button className="ml-3" onClick={handleSubmit(onSubmit)}>
            Enregistrer <Spinner className="ml-2" size={'small'} show={isUpdatePending} />
          </Button>
          <Button
            variant="secondary"
            className="border-2 ml-3"
            onClick={() => {
              reset();
              setOneAddress('');
            }}>
            Annuler
          </Button>
        </div>
      </Form>
    </div>
  );
};

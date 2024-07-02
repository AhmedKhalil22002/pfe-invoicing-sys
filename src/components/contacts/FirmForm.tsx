import React from 'react';
import useCurrency from '@/hooks/useCurrency';
import useActivity from '@/hooks/useActivity';
import useCountry from '@/hooks/useCountry';
import { Button } from '../ui/button';
import { Spinner } from '../common';
import usePaymentCondition from '@/hooks/usePaymentCondition';
import FirmGeneralInformations from './firm/form/FirmGeneralInformations';
import FirmProfessionalInformations from './firm/form/FirmProfessionalInformations';
import FirmAddressInformations from './firm/form/FirmAddressInformations';
import FirmNotesInformations from './firm/form/FirmNotesInformations';
import { Package, ReceiptText } from 'lucide-react';
import { AddressType, CreateFirmDto, api } from '@/api';
import { Form, SubmitHandler, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';

interface FirmFormProps {
  className?: string;
}

export const FirmForm = ({ className }: FirmFormProps) => {
  const router = useRouter();
  const { activities, isFetchActivitiesPending } = useActivity();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { countries, isFetchCountriesPending } = useCountry();
  const { paymentConditions, isFetchPaymentConditionsPending } = usePaymentCondition();
  const [oneAddress, setOneAddress] = React.useState<AddressType>('');

  const { register, control, handleSubmit, watch, reset } = useForm<CreateFirmDto>();

  const { mutate: createFirm, isPending: isCreatePending } = useMutation({
    mutationFn: (data: CreateFirmDto) => api.firm.create(data),
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

  const onSubmit: SubmitHandler<CreateFirmDto> = (data) => {
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

  if (
    isFetchActivitiesPending ||
    isFetchCurrenciesPending ||
    isFetchCountriesPending ||
    isFetchPaymentConditionsPending
  ) {
    return <Spinner className="h-screen" />;
  }

  const handleCopyAddress = (prefix: AddressType) => {
    setOneAddress(oneAddress === prefix ? '' : prefix);
  };

  return (
    <div className={className}>
      <Form control={control}>
        <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
          <FirmGeneralInformations register={register} control={control} />

          <FirmProfessionalInformations
            register={register}
            control={control}
            activities={activities}
            currencies={currencies}
            watch={watch}
            paymentConditions={paymentConditions}
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
          />
        </div>

        <FirmNotesInformations className="mt-5" register={register} />

        <div className="flex my-5">
          <Button className="ml-3" onClick={handleSubmit(onSubmit)}>
            Enregistrer <Spinner className="ml-2" size={'small'} show={isCreatePending} />
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

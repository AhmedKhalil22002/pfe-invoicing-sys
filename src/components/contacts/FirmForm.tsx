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
import { CreateFirmDto, api } from '@/api';
import { SubmitHandler, useForm } from 'react-hook-form';

interface FirmFormProps {
  className?: string;
}

export const FirmForm = ({ className }: FirmFormProps) => {
  const { activities, isFetchActivitiesPending } = useActivity();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { countries, isFetchCountriesPending } = useCountry();
  const { paymentConditions, isFetchPaymentConditionsPending } = usePaymentCondition();

  const {
    register,
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors }
  } = useForm<CreateFirmDto>();

  const onSubmit: SubmitHandler<CreateFirmDto> = (data) => console.log(data);

  const copyAddress = React.useCallback(
    (addressPrefix: 'invoicingAddress' | 'deliveryAddress') => {
      const otherAddressPrefix =
        addressPrefix === 'invoicingAddress' ? 'deliveryAddress' : 'invoicingAddress';
      setValue(addressPrefix, watch(otherAddressPrefix));
    },
    [setValue, watch]
  );

  if (
    isFetchActivitiesPending ||
    isFetchCurrenciesPending ||
    isFetchCountriesPending ||
    isFetchPaymentConditionsPending
  ) {
    return <Spinner className="h-screen" />;
  }

  return (
    <div className={className}>
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <FirmGeneralInformations register={register} control={control} />

        <FirmProfessionalInformations
          register={register}
          control={control}
          activities={activities}
          currencies={currencies}
          paymentConditions={paymentConditions}
        />

        <FirmAddressInformations
          register={register}
          control={control}
          addressPrefix="invoicingAddress"
          icon={<ReceiptText className="h-5 w-5 mr-2" />}
          addressLabel1="Adresse de Facturation"
          addressLabel2="Adresse de Livraison"
          countries={countries}
          handleCopyAddress={() => copyAddress('invoicingAddress')}
          watch={watch}
        />
        <FirmAddressInformations
          register={register}
          control={control}
          addressPrefix="deliveryAddress"
          icon={<Package className="h-5 w-5 mr-2" />}
          addressLabel1="Adresse de Livraison"
          addressLabel2="Adresse de Facturation"
          countries={countries}
          handleCopyAddress={() => copyAddress('deliveryAddress')}
          watch={watch}
        />
      </div>

      <FirmNotesInformations className="mt-5" register={register} />

      <div className="flex my-5">
        <Button className="ml-3" onClick={handleSubmit(onSubmit)}>
          Enregistrer
        </Button>
        <Button variant="secondary" className="border-2 ml-3">
          Annuler
        </Button>
      </div>
    </div>
  );
};

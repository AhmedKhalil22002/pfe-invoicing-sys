import React from 'react';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { Form, useForm } from 'react-hook-form';
import { CreateQuotationDto, Firm } from '@/api';
import { BreadcrumbCommon, Spinner } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import useTax from '@/hooks/useTax';
import useCountry from '@/hooks/useCountry';
import useFirmChoice from '@/hooks/useFirmChoice';
import useBankAccount from '@/hooks/useBankAccount';
import {
  QuotationArticleManagement,
  QuotationControlSection,
  QuotationFinancialInformations,
  QuotationGeneralInformations
} from './form';

interface QuotationFormProps {
  className?: string;
}

export const QuotationCreateForm = ({ className }: QuotationFormProps) => {
  const router = useRouter();
  const { firms, isFetchFirmsPending } = useFirmChoice({
    id: true,
    mainInterlocutor: true,
    invoicingAddress: true,
    deliveryAddress: true,
    currency: true
  });
  const { taxes, isFetchTaxesPending } = useTax();
  const { countries, isFetchCountriesPending } = useCountry();
  const { bankAccounts, isFetchBankAccountsPending } = useBankAccount();
  //toggles
  const [isInvoicingAddressHidden, setIsInvoicingAddressHidden] = React.useState(false);
  const [isDeliveryAddressHidden, setIsDeliveryAddressHidden] = React.useState(false);
  const [isTaxStampHidden, setIsTaxStampHidden] = React.useState(true);
  const [isGeneralConditionHidden, setIsGeneralConditionHidden] = React.useState(false);
  const [isBankAccountHidden, setIsBankAccountHidden] = React.useState(false);

  const { register, control, handleSubmit, watch, reset, setValue } = useForm<CreateQuotationDto>({
    defaultValues: {
      firmId: 0
    }
  });
  const handleFirmChange = (firm: Firm) => {
    const invoicingAddressCountry = countries.find(
      (c) => c.id === firm?.invoicingAddress?.countryId
    );
    setValue('firm.invoicingAddress', {
      ...firm.invoicingAddress,
      country: invoicingAddressCountry
    });
    const deliveryAddressCountry = countries.find((c) => c.id === firm?.deliveryAddress?.countryId);
    setValue('firm.deliveryAddress', {
      ...firm.deliveryAddress,
      country: deliveryAddressCountry
    });

    setValue('firm.currency', firm.currency);
  };

  const loading =
    isFetchFirmsPending ||
    isFetchCountriesPending ||
    isFetchTaxesPending ||
    isFetchBankAccountsPending;
  if (loading) return <Spinner className="h-screen" show={loading} />;
  return (
    <div className={cn('overflow-auto p-8', className)}>
      <BreadcrumbCommon
        hierarchy={[
          { title: 'Vente', href: '/selling' },
          { title: 'Devis', href: '/selling/quotations' },
          { title: 'Nouveau Devis' }
        ]}
      />
      <Form control={control}>
        <div className="block lg:flex gap-4">
          <div className="w-full lg:w-9/12">
            <Card className="w-full">
              <CardContent className="p-5">
                <QuotationGeneralInformations
                  control={control}
                  register={register}
                  watch={watch}
                  firms={firms}
                  handleFirmChange={handleFirmChange}
                  isInvoicingAddressHidden={isInvoicingAddressHidden}
                  isDeliveryAddressHidden={isDeliveryAddressHidden}
                  loading={loading}
                />
                <QuotationArticleManagement
                  className="my-5"
                  taxes={taxes}
                  register={register}
                  control={control}
                  watch={watch}
                />
                <div className="flex gap-10 mt-5">
                  <div className="flex flex-col w-1/2 my-auto">
                    {!isGeneralConditionHidden && (
                      <Textarea
                        placeholder="Conditions Générales"
                        className="resize-none"
                        {...register('generalConditions')}
                      />
                    )}
                    <Button className="mt-3 " variant={'secondary'}>
                      Ajouter des Pièces Jointes
                    </Button>
                  </div>
                  <div className="w-1/2">
                    <QuotationFinancialInformations
                      isTaxStampHidden={isTaxStampHidden}
                      watch={watch}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full mt-5 lg:mt-0 lg:w-3/12">
            <Card className="w-full">
              <CardContent className="p-5">
                <QuotationControlSection
                  toggleInvoicingAddress={() => {
                    setIsInvoicingAddressHidden(!isInvoicingAddressHidden);
                  }}
                  toggleDeliveryAddress={() => {
                    setIsDeliveryAddressHidden(!isDeliveryAddressHidden);
                  }}
                  toggleTaxStamp={() => {
                    setIsTaxStampHidden(!isTaxStampHidden);
                  }}
                  toggleGeneralConditions={() => {
                    setIsGeneralConditionHidden(!isGeneralConditionHidden);
                  }}
                  isBankAccountHidden={isBankAccountHidden}
                  toggleBankAccountHidden={() => {
                    //empty the bank account
                    setIsBankAccountHidden(!isBankAccountHidden);
                  }}
                  bankAccounts={bankAccounts}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
};

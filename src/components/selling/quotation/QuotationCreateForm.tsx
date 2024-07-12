import React from 'react';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { Form, SubmitHandler, useForm, useWatch } from 'react-hook-form';
import { CreateQuotationDto, Firm, QuotationStatus, api } from '@/api';
import { BreadcrumbCommon, Spinner } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import useTax from '@/hooks/content/useTax';
import useCountry from '@/hooks/content/useCountry';
import useFirmChoice from '@/hooks/content/useFirmChoice';
import useBankAccount from '@/hooks/content/useBankAccount';
import {
  QuotationArticleManagement,
  QuotationControlSection,
  QuotationFinancialInformations,
  QuotationGeneralInformations
} from './form';
import { useControlManager } from '@/hooks/functions/useControlManager';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useQuotationArticleManager } from '@/hooks/functions/useArticleManager';

interface QuotationFormProps {
  className?: string;
}

export const QuotationCreateForm = ({ className }: QuotationFormProps) => {
  const router = useRouter();
  //fetches the needed options
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

  //stores
  const controlManager = useControlManager();

  const quotationStore = useQuotationArticleManager();
  const articles = quotationStore((state) => state.articles);
  const getArticles = quotationStore((state) => state.getArticles);

  const { register, control, handleSubmit, watch, reset, setValue } = useForm<CreateQuotationDto>({
    defaultValues: api.quotation.factory()
  });

  //watchers
  const discount =
    useWatch({
      control,
      name: 'discount'
    }) || 0;

  const taxStamp =
    useWatch({
      control,
      name: 'taxStamp'
    }) || 0;

  const firm =
    useWatch({
      control,
      name: 'firm'
    }) || undefined;

  const [subTotal, setSubTotal] = React.useState(
    getArticles()?.reduce((acc, article) => acc + (article?.total || 0), 0) || 0
  );
  const [total, setTotal] = React.useState(subTotal - discount + taxStamp);
  const [currency, setCurrency] = React.useState(firm?.currency || undefined);

  React.useEffect(() => {
    const st = getArticles()?.reduce((acc, article) => acc + (article?.total || 0), 0) || 0;
    setSubTotal(st);
    setTotal(st - discount + taxStamp);
    setCurrency(firm?.currency || undefined);
  }, [articles, discount, taxStamp, firm, getArticles]);

  const onSubmit: SubmitHandler<CreateQuotationDto> = (data) => {
    // Handle form submission
    data = { ...data, articles: getArticles() };
    console.log(data);
    const validation = api.quotation.validate(data);
    if (validation.message)
      toast.error(validation.message, {
        position: validation.position || 'bottom-right'
      });
    else {
      delete data.firm;
      createQuotation({ ...data, total: total, subTotal: subTotal });
    }
  };

  const { mutate: createQuotation, isPending: isCreatePending } = useMutation({
    mutationFn: (data: CreateQuotationDto) => api.quotation.create(data),
    onSuccess: () => {
      router.push(`/selling/quotations`);
      toast.success('Devis crée avec succès', { position: 'bottom-right' });
    },
    onError: (error) => {
      const message = getErrorMessage(error, 'Erreur lors de la création de devis');
      toast.error(message, {
        position: 'bottom-right'
      });
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
                {/* General Informations */}
                <QuotationGeneralInformations
                  control={control}
                  register={register}
                  watch={watch}
                  setValue={setValue}
                  firms={firms}
                  handleFirmChange={handleFirmChange}
                  isInvoicingAddressHidden={controlManager.isInvoiceAddressHidden}
                  isDeliveryAddressHidden={controlManager.isDeliveryAddressHidden}
                  loading={loading}
                />

                {/* Article Management */}
                <QuotationArticleManagement
                  className="my-5"
                  taxes={taxes}
                  isArticleDescriptionHidden={controlManager.isArticleDescriptionHidden}
                  currency={currency}
                />

                {/* Other Informations */}
                <div className="flex gap-10 mt-5">
                  <div className="flex flex-col w-1/2 my-auto">
                    {!controlManager.isGeneralConditionsHidden && (
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
                    {/* Final Financial Informations */}
                    <QuotationFinancialInformations
                      isTaxStampHidden={controlManager.isTaxStampHidden}
                      register={register}
                      subTotal={subTotal || 0}
                      total={total || 0}
                      currency={currency}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          <div className="w-full mt-5 lg:mt-0 lg:w-3/12">
            <Card className="w-full">
              <CardContent className="p-5">
                {/* Control Section */}
                <QuotationControlSection
                  toggleInvoicingAddress={() => {
                    controlManager.toggle('isInvoiceAddressHidden');
                  }}
                  toggleDeliveryAddress={() => {
                    controlManager.toggle('isDeliveryAddressHidden');
                  }}
                  toggleTaxStamp={() => {
                    controlManager.toggle('isTaxStampHidden');
                  }}
                  toggleGeneralConditions={() => {
                    controlManager.toggle('isGeneralConditionsHidden');
                  }}
                  toggleBankAccountHidden={() => {
                    //empty the bank account
                    controlManager.toggle('isBankAccountDetailsHidden');
                  }}
                  toggleArticleDescriptionHidden={() => {
                    //empty the bank account
                    controlManager.toggle('isArticleDescriptionHidden');
                  }}
                  isBankAccountDetailsHidden={controlManager.isBankAccountDetailsHidden}
                  bankAccounts={bankAccounts}
                  handleSubmitVerfied={handleSubmit((data) =>
                    onSubmit({ ...data, status: QuotationStatus.Validated })
                  )}
                  handleSubmitDraft={handleSubmit((data) =>
                    onSubmit({ ...data, status: QuotationStatus.Draft })
                  )}
                  handleSubmitSent={handleSubmit((data) =>
                    onSubmit({ ...data, status: QuotationStatus.Sent })
                  )}
                  reset={reset}
                  register={register}
                  loading={isCreatePending}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </Form>
    </div>
  );
};

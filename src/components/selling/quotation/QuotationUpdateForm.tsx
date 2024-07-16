import React from 'react';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { QuotationStatus, UpdateQuotationDto, api } from '@/api';
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
import { useMutation, useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { useQuotationArticleManager } from '@/hooks/functions/useArticleManager';
import { DiscountType } from '@/api/enums/discount-types';
import { useInvoicingManager } from '@/hooks/functions/useInvoicingInformations';
import { useDebounce } from '@/hooks/other/useDebounce';

interface QuotationFormProps {
  className?: string;
  quotationId: string;
}

export const QuotationUpdateForm = ({ className, quotationId }: QuotationFormProps) => {
  const router = useRouter();

  const {
    isPending: isFetchPending,
    error,
    data: quotationResp,
    refetch: refetchQuotation
  } = useQuery({
    queryKey: ['quotation', quotationId],
    queryFn: () => api.quotation.findOne(+quotationId)
  });

  // Fetch options
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
  //

  // Stores
  const quotationManager = useInvoicingManager();
  const currency = quotationManager.firm?.currency;

  const controlManager = useControlManager();

  const articleStore = useQuotationArticleManager();
  const articles = articleStore((state) => state.articles);
  const setArticles = articleStore((state) => state.setArticles);
  const getArticles = articleStore((state) => state.getArticles);
  const resetItems = articleStore((state) => state.reset);
  //

  React.useEffect(() => {
    quotationManager.set('id', quotationResp?.id);
    quotationManager.set('date', quotationResp?.date);
    quotationManager.set('dueDate', quotationResp?.dueDate);
    quotationManager.set('object', quotationResp?.object);
    quotationManager.set('firm', quotationResp?.firm);
    quotationManager.set('interlocutor', quotationResp?.interlocutor);
    quotationManager.set('discount', quotationResp?.discount);
    quotationManager.set('discountType', quotationResp?.discount_type);
    if (quotationResp?.taxStamp) controlManager.set('isTaxStampHidden', false);
    quotationManager.set('taxStamp', quotationResp?.taxStamp);
    quotationManager.set('notes', quotationResp?.notes);
    quotationManager.set('generalConditions', quotationResp?.generalConditions);
    quotationManager.set('isInterlocutorInFirm', true);
    setArticles(quotationResp?.articles || []);
  }, [quotationResp]);

  // Watchers
  const discount = quotationManager.discount;
  const discount_type = quotationManager.discountType || DiscountType.PERCENTAGE;
  const taxStamp = quotationManager.taxStamp || 0;

  React.useEffect(() => {
    const subTotal = getArticles()?.reduce((acc, article) => acc + (article?.total || 0), 0) || 0;
    quotationManager.set('subTotal', subTotal);
    if (discount_type === DiscountType.PERCENTAGE) {
      quotationManager.set('total', subTotal - (subTotal * discount) / 100 + taxStamp);
    } else {
      quotationManager.set('total', subTotal - discount + taxStamp);
    }
  }, [articles, discount, discount_type, taxStamp]);

  const { mutate: updateQuotation, isPending: isUpdatingPending } = useMutation({
    mutationFn: (data: UpdateQuotationDto) => api.quotation.update(data),
    onSuccess: () => {
      router.push('/selling/quotations');
      toast.success('Devis modifié avec succès', { position: 'bottom-right' });
    },
    onError: (error) => {
      const message = getErrorMessage(error, 'Erreur lors de la modification de devis');
      toast.error(message, { position: 'bottom-right' });
    }
  });

  const onSubmit = (status: QuotationStatus) => {
    const articleDto = getArticles()?.map((article) => ({
      article: {
        title: article?.article?.title,
        description: controlManager.isArticleDescriptionHidden ? '' : article?.article?.description
      },
      quantity: article?.quantity,
      unit_price: article?.unit_price,
      discount: article?.discount,
      discount_type:
        article?.discount_type === 'PERCENTAGE' ? DiscountType.PERCENTAGE : DiscountType.AMOUNT,
      taxes: article?.taxes?.map((tax) => ({ id: tax?.id, rate: tax?.rate }))
    }));

    const data: UpdateQuotationDto = {
      id: quotationManager.id,
      date: quotationManager.date.toString(),
      dueDate: quotationManager.dueDate.toString(),
      object: quotationManager.object,
      firmId: quotationManager.firm?.id,
      interlocutorId: quotationManager.interlocutor?.id,
      currencyId: currency?.id,
      status,
      generalConditions: quotationManager.generalConditions,
      notes: quotationManager.notes,
      articles: articleDto,
      discount: quotationManager.discount,
      taxStamp: quotationManager.taxStamp,
      discount_type:
        quotationManager.discountType === 'PERCENTAGE'
          ? DiscountType.PERCENTAGE
          : DiscountType.AMOUNT
    };

    const validation = api.quotation.validate(data);
    if (validation.message) {
      toast.error(validation.message, { position: validation.position || 'bottom-right' });
    } else {
      if (controlManager.isTaxStampHidden) delete data.taxStamp;
      if (controlManager.isGeneralConditionsHidden) delete data.generalConditions;
      updateQuotation(data);
      quotationManager.reset();
      resetItems();
      controlManager.reset();
    }
  };

  const loading =
    isFetchFirmsPending ||
    isFetchCountriesPending ||
    isFetchTaxesPending ||
    isFetchBankAccountsPending;
  const { value: debounceLoading } = useDebounce<boolean>(loading, 500);
  return (
    <div className={cn('overflow-auto p-8', className)}>
      <BreadcrumbCommon
        hierarchy={[
          { title: 'Vente', href: '/selling' },
          { title: 'Devis', href: '/selling/quotations' },
          { title: 'Devis N°' + quotationId }
        ]}
      />
      <div className="block lg:flex gap-4">
        <div className="w-full lg:w-9/12">
          <Card className="w-full">
            <CardContent className="p-5">
              {/* General Informations */}
              <QuotationGeneralInformations
                firms={firms}
                isInvoicingAddressHidden={controlManager.isInvoiceAddressHidden}
                isDeliveryAddressHidden={controlManager.isDeliveryAddressHidden}
                loading={debounceLoading}
              />

              {/* Article Management */}
              <QuotationArticleManagement
                className="my-5"
                taxes={taxes}
                isArticleDescriptionHidden={controlManager.isArticleDescriptionHidden}
                currency={currency}
                loading={debounceLoading}
              />

              {/* Other Informations */}
              <div className="flex gap-10 mt-5">
                <div className="flex flex-col w-1/2 my-auto">
                  {!controlManager.isGeneralConditionsHidden && (
                    <Textarea
                      placeholder="Conditions Générales"
                      className="resize-none"
                      value={quotationManager.generalConditions}
                      onChange={(e) => quotationManager.set('generalConditions', e.target.value)}
                      isPending={debounceLoading || false}
                    />
                  )}
                  <Button className="mt-3" variant={'secondary'}>
                    Ajouter des Pièces Jointes
                  </Button>
                </div>
                <div className="w-1/2">
                  {/* Final Financial Informations */}
                  <QuotationFinancialInformations
                    isTaxStampHidden={controlManager.isTaxStampHidden}
                    subTotal={quotationManager.subTotal}
                    total={quotationManager.total}
                    currency={currency}
                    loading={debounceLoading}
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
                toggleInvoicingAddress={() => controlManager.toggle('isInvoiceAddressHidden')}
                toggleDeliveryAddress={() => controlManager.toggle('isDeliveryAddressHidden')}
                toggleTaxStamp={() => controlManager.toggle('isTaxStampHidden')}
                toggleGeneralConditions={() => controlManager.toggle('isGeneralConditionsHidden')}
                toggleBankAccountHidden={() => controlManager.toggle('isBankAccountDetailsHidden')}
                toggleArticleDescriptionHidden={() =>
                  controlManager.toggle('isArticleDescriptionHidden')
                }
                isBankAccountDetailsHidden={controlManager.isBankAccountDetailsHidden}
                bankAccounts={bankAccounts}
                handleSubmitVerfied={() => onSubmit(QuotationStatus.Validated)}
                handleSubmitDraft={() => onSubmit(QuotationStatus.Draft)}
                handleSubmitSent={() => onSubmit(QuotationStatus.Sent)}
                reset={() => {
                  resetItems();
                }}
                operationLoading={isUpdatingPending}
                dataLoading={debounceLoading}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

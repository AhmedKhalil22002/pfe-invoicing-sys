import React from 'react';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { ArticleQuotationEntry, QUOTATION_STATUS, UpdateQuotationDto, api, currency } from '@/api';
import { BreadcrumbCommon } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import useTax from '@/hooks/content/useTax';
import useFirmChoice from '@/hooks/content/useFirmChoice';
import useBankAccount from '@/hooks/content/useBankAccount';
import {
  QuotationArticleManagement,
  QuotationControlSection,
  QuotationFinancialInformation,
  QuotationGeneralInformation
} from './form';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { DISCOUNT_TYPE } from '@/api/enums/discount-types';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useQuotationManager } from './hooks/useQuotationManager';
import { useQuotationArticleManagerStore } from './hooks/useQuotationArticleManager';
import { fromStringToSequentialObject } from '@/utils/string.utils';
import { useQuotationControlManager } from './hooks/useQuotationControlManager';
import _ from 'lodash';
import useCurrency from '@/hooks/content/useCurrency';

interface QuotationFormProps {
  className?: string;
  quotationId: string;
}

export const QuotationUpdateForm = ({ className, quotationId }: QuotationFormProps) => {
  const router = useRouter();

  //Fetch options
  const {
    isPending: isFetchPending,
    data: quotationResp,
    refetch: refetchQuotation
  } = useQuery({
    queryKey: ['quotation', quotationId],
    queryFn: () => api.quotation.findOne(parseInt(quotationId))
  });
  const { taxes, isFetchTaxesPending } = useTax();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { bankAccounts, isFetchBankAccountsPending } = useBankAccount();

  const quotation = React.useMemo(() => {
    if (!quotationResp) return null;
    return quotationResp;
  }, [quotationResp]);

  // Fetch options
  const { firms, isFetchFirmsPending } = useFirmChoice([
    'interlocutorsToFirm',
    'invoicingAddress',
    'deliveryAddress',
    'currency'
  ]);

  // Stores
  const quotationManager = useQuotationManager();
  const controlManager = useQuotationControlManager();
  const articleStore = useQuotationArticleManagerStore();

  const [initialData, setInitialData] = React.useState<any>();

  const loadValues = () => {
    //quotation infos
    quotationManager.set('id', quotation?.id);
    quotationManager.set(
      'sequentialNumber',
      fromStringToSequentialObject(quotation?.sequential || '')
    );
    quotationManager.set('status', quotation?.status);
    quotationManager.set('date', quotation?.date);
    quotationManager.set('dueDate', quotation?.dueDate);
    quotationManager.set('object', quotation?.object);
    quotationManager.set('firm', quotation?.firm);
    quotationManager.set('interlocutor', quotation?.interlocutor);
    quotationManager.set('discount', quotation?.discount);
    quotationManager.set('discountType', quotation?.discount_type);
    quotationManager.set('bankAccount', quotation?.bankAccount);
    quotationManager.set('currency', quotation?.currency || quotation?.firm?.currency);
    quotationManager.set('taxStamp', quotation?.taxStamp);
    quotationManager.set('notes', quotation?.notes);
    quotationManager.set('generalConditions', quotation?.generalConditions);
    quotationManager.set('isInterlocutorInFirm', true);
    quotationManager.set('status', quotation?.status);
    //quotation meta infos
    controlManager.set('isInvoiceAddressHidden', !quotation?.quotationMetaData?.showInvoiceAddress);
    controlManager.set(
      'isDeliveryAddressHidden',
      !quotation?.quotationMetaData?.showDeliveryAddress
    );
    controlManager.set('isTaxStampHidden', !quotation?.taxStamp);
    controlManager.set('isGeneralConditionsHidden', !quotation?.generalConditions);
    controlManager.set('isTaxStampHidden', !quotation?.taxStamp);

    //quotation article infos
    articleStore.setArticles(quotation?.articleQuotationEntries || []);
    setInitialData({
      ...quotationManager.getQuotation(),
      ...articleStore.getArticles(),
      ...controlManager.getControls()
    });
  };

  //load fetched values of the quotation
  React.useEffect(() => {
    loadValues();
  }, [quotation, quotationId]);

  // Watchers
  const discount = quotationManager.discount;
  const discount_type = quotationManager.discountType || DISCOUNT_TYPE.PERCENTAGE;
  const taxStamp = quotationManager.taxStamp || 0;

  // perform calculations when the financial Information are changed
  React.useEffect(() => {
    const subTotal =
      articleStore.getArticles()?.reduce((acc, article) => acc + (article?.subTotal || 0), 0) || 0;
    const total =
      articleStore.getArticles()?.reduce((acc, article) => acc + (article?.total || 0), 0) || 0;
    quotationManager.set('subTotal', subTotal);
    if (discount_type === DISCOUNT_TYPE.PERCENTAGE) {
      quotationManager.set('total', total * (1 - discount / 100) + taxStamp);
    } else {
      quotationManager.set('total', total - discount + taxStamp);
    }
  }, [articleStore.articles, discount, discount_type, taxStamp]);

  // the update quotation call
  const { mutate: updateQuotation, isPending: isUpdatingPending } = useMutation({
    mutationFn: (data: UpdateQuotationDto) => api.quotation.update(data),
    onSuccess: () => {
      // router.push('/selling/quotations');
      toast.success('Devis modifié avec succès', { position: 'bottom-right' });
      refetchQuotation();
    },
    onError: (error) => {
      const message = getErrorMessage('contacts', error, 'Erreur lors de la modification de devis');
      toast.error(message, { position: 'bottom-right' });
    }
  });

  const globalReset = () => {
    loadValues();
  };

  //submit function
  const onSubmit = (status: QUOTATION_STATUS) => {
    const articleDto: ArticleQuotationEntry[] = articleStore.getArticles()?.map((article) => ({
      article: {
        title: article?.article?.title,
        description: controlManager.isArticleDescriptionHidden ? '' : article?.article?.description
      },
      quantity: article?.quantity || 0,
      unit_price: article?.unit_price || 0,
      discount: article?.discount || 0,
      discount_type:
        article?.discount_type === 'PERCENTAGE' ? DISCOUNT_TYPE.PERCENTAGE : DISCOUNT_TYPE.AMOUNT,
      taxes: article?.articleQuotationEntryTaxes?.map((entry) => entry?.tax?.id) || []
    }));

    const data: UpdateQuotationDto = {
      id: quotationManager?.id,
      date: quotationManager?.date?.toString(),
      dueDate: quotationManager?.dueDate?.toString(),
      object: quotationManager?.object,
      cabinetId: quotationManager?.firm?.cabinetId,
      firmId: quotationManager?.firm?.id,
      interlocutorId: quotationManager?.interlocutor?.id,
      currencyId: quotationManager?.currency?.id,
      bankAccountId: quotationManager?.bankAccount?.id,
      status,
      generalConditions: quotationManager?.generalConditions,
      notes: quotationManager?.notes,
      articleQuotationEntries: articleDto,
      discount: quotationManager?.discount,
      taxStamp: !controlManager.isTaxStampHidden ? quotationManager?.taxStamp : 0,
      discount_type:
        quotationManager?.discountType === 'PERCENTAGE'
          ? DISCOUNT_TYPE.PERCENTAGE
          : DISCOUNT_TYPE.AMOUNT,
      quotationMetaData: {
        showDeliveryAddress: !controlManager?.isDeliveryAddressHidden,
        showInvoiceAddress: !controlManager?.isInvoiceAddressHidden
      }
    };

    const validation = api.quotation.validate(data);
    if (validation.message) {
      toast.error(validation.message, { position: validation.position || 'bottom-right' });
    } else {
      updateQuotation(data);
    }
  };

  const loading =
    isFetchPending ||
    isFetchFirmsPending ||
    isFetchTaxesPending ||
    isFetchCurrenciesPending ||
    isFetchBankAccountsPending;
  const { value: debounceLoading } = useDebounce<boolean>(loading, 500);

  return (
    <div className={cn('overflow-auto p-8', className)}>
      <BreadcrumbCommon
        hierarchy={[
          { title: 'Vente', href: '/selling' },
          { title: 'Devis', href: '/selling/quotations' },
          { title: 'Devis N° ' + quotation?.sequential }
        ]}
      />
      <div className="block lg:flex gap-4">
        <div className="w-full lg:w-9/12">
          <Card className="w-full">
            <CardContent className="p-5">
              {/* General Information */}
              <QuotationGeneralInformation
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
                currency={quotationManager.currency}
                loading={debounceLoading}
              />

              {/* Other Information */}
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
                  {/* Final Financial Information */}
                  <QuotationFinancialInformation
                    isTaxStampHidden={controlManager.isTaxStampHidden}
                    subTotal={quotationManager.subTotal}
                    total={quotationManager.total}
                    currency={quotationManager.currency}
                    loading={debounceLoading}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full mt-5 lg:mt-0 lg:w-3/12">
          <div className="sticky top-0">
            <Card className="w-full">
              <CardContent className="p-5">
                {/* Control Section */}
                <QuotationControlSection
                  status={quotationManager.status}
                  isDataAltered={_.isEqual(initialData, {
                    ...quotationManager.getQuotation(),
                    ...articleStore.getArticles(),
                    ...controlManager.getControls()
                  })}
                  bankAccounts={bankAccounts}
                  currencies={currencies}
                  handleSubmit={() => onSubmit(quotationManager.status)}
                  handleSubmitDraft={() => onSubmit(QUOTATION_STATUS.Draft)}
                  handleSubmitDuplicate={() => onSubmit(QUOTATION_STATUS.Draft)}
                  handleSubmitValidated={() => onSubmit(QUOTATION_STATUS.Validated)}
                  handleSubmitSent={() => onSubmit(QUOTATION_STATUS.Sent)}
                  handleSubmitAccepted={() => onSubmit(QUOTATION_STATUS.Accepted)}
                  handleSubmitRejected={() => onSubmit(QUOTATION_STATUS.Rejected)}
                  reset={globalReset}
                  loading={debounceLoading}
                />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

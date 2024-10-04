import React from 'react';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { api } from '@/api';
import { ArticleQuotationEntry, CreateQuotationDto, QUOTATION_STATUS } from '@/types';
import { BreadcrumbCommon, Spinner } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
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
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { DISCOUNT_TYPE } from '@/types/enums/discount-types';
import { useQuotationManager } from '@/components/selling/quotation/hooks/useQuotationManager';
import { useQuotationArticleManager } from './hooks/useQuotationArticleManager';
import useQuotationSocket from './hooks/useQuotationSocket';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useQuotationControlManager } from './hooks/useQuotationControlManager';
import useCurrency from '@/hooks/content/useCurrency';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import useCabinet from '@/hooks/content/useCabinet';
import { QuotationExtraOptions } from './form/QuotationExtraOptions';
import useDefaultCondition from '@/hooks/content/useDefaultCondition';
import { ACTIVITY_TYPE } from '@/types/enums/activity-type';
import { DOCUMENT_TYPE } from '@/types/enums/document-type';
import { QuotationGeneralConditions } from './form/QuotationGeneralConditions';
interface QuotationFormProps {
  className?: string;
  firmId: string;
}

export const QuotationCreateForm = ({ className, firmId }: QuotationFormProps) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const router = useRouter();

  // Fetch options
  const { firms, isFetchFirmsPending } = useFirmChoice([
    'interlocutorsToFirm',
    'interlocutorsToFirm.interlocutor',
    'paymentCondition',
    'invoicingAddress',
    'deliveryAddress',
    'currency'
  ]);
  const { cabinet, isFetchCabinetPending } = useCabinet();
  const { taxes, isFetchTaxesPending } = useTax();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { bankAccounts, isFetchBankAccountsPending } = useBankAccount();
  const { defaultCondition, isFetchDefaultConditionPending } = useDefaultCondition(
    ACTIVITY_TYPE.SELLING,
    DOCUMENT_TYPE.QUOTATION
  );

  //websocket to listen for server changes related to sequence number
  const { sequence, isQuotationSequencePending } = useQuotationSocket();

  // Stores
  const quotationManager = useQuotationManager();
  const articleStore = useQuotationArticleManager();
  const controlManager = useQuotationControlManager();
  //handle Sequential Number
  React.useEffect(() => {
    quotationManager.set('sequentialNumber', sequence);
    quotationManager.set(
      'bankAccount',
      bankAccounts.find((a) => a.isMain)
    );
    quotationManager.set('currency', cabinet?.currency);
  }, [sequence]);

  // Watchers
  const discount = quotationManager.discount;
  const discount_type = quotationManager.discountType || DISCOUNT_TYPE.PERCENTAGE;
  const taxStamp = quotationManager.taxStamp || 0;

  React.useEffect(() => {
    const subTotal =
      articleStore.getArticles()?.reduce((acc, article) => acc + (article?.subTotal || 0), 0) || 0;
    quotationManager.set('subTotal', subTotal);
    const total =
      articleStore.getArticles()?.reduce((acc, article) => acc + (article?.total || 0), 0) || 0;
    quotationManager.set('subTotal', subTotal);
    if (discount_type === DISCOUNT_TYPE.PERCENTAGE) {
      quotationManager.set('total', total - (total * discount) / 100 + taxStamp);
    } else {
      quotationManager.set('total', total - discount + taxStamp);
    }
  }, [articleStore.articles, discount, discount_type, taxStamp]);

  const { mutate: createQuotation, isPending: isCreatePending } = useMutation({
    mutationFn: (data: { quotation: CreateQuotationDto; files: File[] }) =>
      api.quotation.create(data.quotation, data.files),
    onSuccess: () => {
      if (!firmId) router.push('/selling/quotations');
      else router.push(`/contacts/firm/${firmId}/?tab=quotations`);
      toast.success('Devis crée avec succès');
    },
    onError: (error) => {
      const message = getErrorMessage('', error, 'Erreur lors de la création de devis');
      toast.error(message);
    }
  });

  //Reset Form
  const globalReset = () => {
    quotationManager.reset();
    articleStore.reset();
    controlManager.reset();
  };

  React.useEffect(() => {
    globalReset();
    articleStore.add();
  }, []);

  const onSubmit = (status: QUOTATION_STATUS) => {
    const articlesDto: ArticleQuotationEntry[] = articleStore.getArticles()?.map((article) => ({
      id: article?.id,
      article: {
        title: article?.article?.title || '',
        description: !controlManager.isArticleDescriptionHidden
          ? article?.article?.description || ''
          : ''
      },
      quantity: article?.quantity || 0,
      unit_price: article?.unit_price || 0,
      discount: article?.discount || 0,
      discount_type:
        article?.discount_type === 'PERCENTAGE' ? DISCOUNT_TYPE.PERCENTAGE : DISCOUNT_TYPE.AMOUNT,
      taxes: article?.articleQuotationEntryTaxes?.map((entry) => {
        return entry?.tax?.id;
      })
    }));

    const quotation: CreateQuotationDto = {
      date: quotationManager?.date?.toString(),
      dueDate: quotationManager?.dueDate?.toString(),
      object: quotationManager?.object,
      cabinetId: quotationManager?.firm?.cabinetId,
      firmId: quotationManager?.firm?.id,
      interlocutorId: quotationManager?.interlocutor?.id,
      currencyId: quotationManager?.currency?.id,
      bankAccountId: !controlManager?.isBankAccountDetailsHidden
        ? quotationManager?.bankAccount?.id
        : undefined,
      status,
      generalConditions: !controlManager.isGeneralConditionsHidden
        ? quotationManager?.generalConditions
        : '',
      defaultCondition: quotationManager.defaultCondition === 'USED',
      notes: quotationManager?.notes,
      articleQuotationEntries: articlesDto,
      discount: quotationManager?.discount,
      taxStamp: !controlManager.isTaxStampHidden ? quotationManager?.taxStamp : 0,
      discount_type:
        quotationManager?.discountType === 'PERCENTAGE'
          ? DISCOUNT_TYPE.PERCENTAGE
          : DISCOUNT_TYPE.AMOUNT,
      quotationMetaData: {
        showDeliveryAddress: !controlManager?.isDeliveryAddressHidden,
        showInvoiceAddress: !controlManager?.isInvoiceAddressHidden,
        showArticleDescription: !controlManager?.isArticleDescriptionHidden,
        hasBankingDetails: !controlManager.isBankAccountDetailsHidden,
        hasGeneralConditions: !controlManager.isGeneralConditionsHidden,
        hasTaxStamp: !controlManager.isTaxStampHidden
      }
    };
    const validation = api.quotation.validate(quotation);
    if (validation.message) {
      toast.error(validation.message);
    } else {
      if (controlManager.isTaxStampHidden) delete quotation.taxStamp;
      if (controlManager.isGeneralConditionsHidden) delete quotation.generalConditions;
      createQuotation({
        quotation,
        files: quotationManager.uploadedFiles.filter((u) => !u.upload).map((u) => u.file)
      });
      globalReset();
    }
  };
  const loading =
    isFetchFirmsPending ||
    isFetchTaxesPending ||
    isFetchCabinetPending ||
    isFetchBankAccountsPending ||
    isFetchCurrenciesPending ||
    isFetchDefaultConditionPending ||
    isCreatePending;
  const { value: debounceLoading } = useDebounce<boolean>(loading, 500);

  if (debounceLoading) return <Spinner className="h-screen" show={loading} />;

  return (
    <div className={cn('overflow-auto p-8', className)}>
      <BreadcrumbCommon
        hierarchy={
          !firmId
            ? [
                { title: tCommon('menu.selling'), href: '/selling' },
                { title: tInvoicing('quotation.plural'), href: '/selling/quotations' },
                { title: tInvoicing('quotation.new') }
              ]
            : [
                { title: tCommon('menu.contacts'), href: '/contacts' },
                { title: 'Entreprises', href: '/contacts/firms' },
                {
                  title: `Entreprise N°${firmId}`,
                  href: `/contacts/firm/${firmId}?tab=entreprise`
                },
                { title: 'Nouveau Devis' }
              ]
        }
      />
      {/* Main Container */}
      <div className="block xl:flex gap-4">
        {/* First Card */}
        <div className="w-full h-auto flex flex-col xl:w-9/12">
          <ScrollArea className=" max-h-[calc(100vh-200px)] border rounded-lg">
            <Card className="border-0">
              <CardContent className="p-5">
                {/* General Information */}
                <QuotationGeneralInformation
                  className="my-5"
                  firms={firms}
                  isInvoicingAddressHidden={controlManager.isInvoiceAddressHidden}
                  isDeliveryAddressHidden={controlManager.isDeliveryAddressHidden}
                  loading={isFetchFirmsPending || isQuotationSequencePending}
                />
                {/* Article Management */}
                <QuotationArticleManagement
                  className="my-5"
                  taxes={taxes}
                  isArticleDescriptionHidden={controlManager.isArticleDescriptionHidden}
                />
                {/* File Upload & Notes */}
                <QuotationExtraOptions />
                {/* Other Information */}
                <div className="flex gap-10 mt-5">
                  <QuotationGeneralConditions
                    className="flex flex-col w-2/3 my-auto"
                    isPending={debounceLoading}
                    hidden={controlManager.isGeneralConditionsHidden}
                    defaultCondition={defaultCondition}
                  />
                  <div className="w-1/3 my-auto">
                    {/* Final Financial Information */}
                    <QuotationFinancialInformation
                      isTaxStampHidden={controlManager.isTaxStampHidden}
                      subTotal={quotationManager.subTotal}
                      total={quotationManager.total}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        </div>
        {/* Second Card */}
        <div className="w-full xl:mt-0 xl:w-3/12">
          <ScrollArea className=" max-h-[calc(100vh-200px)] border rounded-lg">
            <Card className="border-0">
              <CardContent className="p-5">
                {/* Control Section */}
                <QuotationControlSection
                  bankAccounts={bankAccounts}
                  currencies={currencies}
                  handleSubmitDraft={() => onSubmit(QUOTATION_STATUS.Draft)}
                  handleSubmitValidated={() => onSubmit(QUOTATION_STATUS.Validated)}
                  handleSubmitSent={() => onSubmit(QUOTATION_STATUS.Sent)}
                  reset={globalReset}
                  loading={debounceLoading}
                />
              </CardContent>
            </Card>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

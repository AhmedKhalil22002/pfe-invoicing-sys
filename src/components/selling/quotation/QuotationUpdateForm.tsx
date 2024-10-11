import React from 'react';
import { cn } from '@/lib/utils';
import { api, upload } from '@/api';
import {
  ArticleQuotationEntry,
  QUOTATION_STATUS,
  QuotationUpload,
  UpdateQuotationDto
} from '@/types';
import { BreadcrumbCommon, Spinner } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
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
import { DISCOUNT_TYPE } from '@/types/enums/discount-types';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useQuotationManager } from './hooks/useQuotationManager';
import { useQuotationArticleManager } from './hooks/useQuotationArticleManager';
import { fromStringToSequentialObject } from '@/utils/string.utils';
import { useQuotationControlManager } from './hooks/useQuotationControlManager';
import _ from 'lodash';
import useCurrency from '@/hooks/content/useCurrency';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import { QuotationExtraOptions } from './form/QuotationExtraOptions';
import { QuotationGeneralConditions } from './form/QuotationGeneralConditions';
import useDefaultCondition from '@/hooks/content/useDefaultCondition';
import { ACTIVITY_TYPE } from '@/types/enums/activity-type';
import { DOCUMENT_TYPE } from '@/types/enums/document-type';
import { useRouter } from 'next/router';
import { useBreadcrumb } from '@/components/layout/BreadcrumbContext';

interface QuotationFormProps {
  className?: string;
  quotationId: string;
}

export const QuotationUpdateForm = ({ className, quotationId }: QuotationFormProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');

  //Fetch options
  const {
    isPending: isFetchPending,
    data: quotationResp,
    refetch: refetchQuotation
  } = useQuery({
    queryKey: ['quotation', quotationId],
    queryFn: () => api.quotation.findOne(parseInt(quotationId))
  });

  const quotation = React.useMemo(() => {
    return quotationResp || null;
  }, [quotationResp]);

  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    if (quotation?.sequential)
      setRoutes([
        { title: tCommon('menu.selling'), href: '/selling' },
        { title: tInvoicing('quotation.plural'), href: '/selling/quotations' },
        { title: tInvoicing('quotation.singular') + ' N° ' + quotation?.sequential }
      ]);
  }, [router.locale, quotation?.sequential]);

  const { taxes, isFetchTaxesPending } = useTax();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { bankAccounts, isFetchBankAccountsPending } = useBankAccount();
  const { defaultCondition, isFetchDefaultConditionPending } = useDefaultCondition(
    ACTIVITY_TYPE.SELLING,
    DOCUMENT_TYPE.QUOTATION
  );

  // Fetch options
  const { firms, isFetchFirmsPending } = useFirmChoice([
    'interlocutorsToFirm',
    'interlocutorsToFirm.interlocutor',
    'invoicingAddress',
    'deliveryAddress',
    'currency'
  ]);

  // Stores
  const quotationManager = useQuotationManager();
  const controlManager = useQuotationControlManager();
  const articleStore = useQuotationArticleManager();

  const [initialData, setInitialData] = React.useState<any>();

  const loadValues = () => {
    //quotation infos
    quotationManager.set('id', quotation?.id);
    quotationManager.set(
      'sequentialNumber',
      fromStringToSequentialObject(quotation?.sequential || '')
    );
    quotationManager.set('status', quotation?.status);
    quotationManager.set('date', new Date(quotation?.date || ''));
    quotationManager.set('dueDate', new Date(quotation?.dueDate || ''));
    quotationManager.set('object', quotation?.object);
    quotationManager.set(
      'firm',
      firms.find((firm) => quotation?.firm?.id === firm.id)
    );
    quotationManager.set('interlocutor', quotation?.interlocutor);
    quotationManager.set('discount', quotation?.discount);
    quotationManager.set('discountType', quotation?.discount_type);
    quotationManager.set(
      'bankAccount',
      quotation?.bankAccount || bankAccounts.find((a) => a.isMain)
    );
    quotationManager.set('currency', quotation?.currency || quotation?.firm?.currency);
    quotationManager.set('taxStamp', quotation?.taxStamp);
    quotationManager.set('notes', quotation?.notes);
    quotationManager.set('generalConditions', quotation?.generalConditions);
    quotationManager.set('defaultCondition', quotation?.defaultCondition ? 'USED' : 'UNUSED');
    quotationManager.set('isInterlocutorInFirm', true);
    quotationManager.set('status', quotation?.status);
    quotationManager.set('uploadedFiles', quotation?.files);

    //quotation meta infos
    controlManager.set(
      'isBankAccountDetailsHidden',
      !quotation?.quotationMetaData?.hasBankingDetails
    );
    controlManager.set('isInvoiceAddressHidden', !quotation?.quotationMetaData?.showInvoiceAddress);
    controlManager.set(
      'isDeliveryAddressHidden',
      !quotation?.quotationMetaData?.showDeliveryAddress
    );
    controlManager.set(
      'isArticleDescriptionHidden',
      !quotation?.quotationMetaData?.showArticleDescription
    );
    controlManager.set(
      'isGeneralConditionsHidden',
      !quotation?.quotationMetaData?.hasGeneralConditions
    );
    controlManager.set('isTaxStampHidden', !quotation?.quotationMetaData?.hasTaxStamp);

    //quotation article infos
    articleStore.setArticles(quotation?.articleQuotationEntries || []);
    setInitialData({
      quotation: quotationManager.getQuotation(),
      articles: articleStore.getArticles(),
      controls: controlManager.getControls()
    });
  };

  //load fetched values of the quotation
  React.useEffect(() => {
    loadValues();
  }, [quotation]);

  // Watchers
  const discount = quotationManager.discount;
  const discount_type = quotationManager.discountType || DISCOUNT_TYPE.PERCENTAGE;
  const taxStamp = quotationManager.taxStamp || 0;

  // perform calculations when the financialy Information are changed
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
    mutationFn: (data: { quotation: UpdateQuotationDto; files: File[] }) =>
      api.quotation.update(data.quotation, data.files),
    onSuccess: () => {
      toast.success('Devis modifié avec succès');
      refetchQuotation();
    },
    onError: (error) => {
      const message = getErrorMessage('contacts', error, 'Erreur lors de la modification de devis');
      toast.error(message);
    }
  });

  const globalReset = () => {
    loadValues();
  };

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

    const quotation: UpdateQuotationDto = {
      id: quotationManager?.id,
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
      articleQuotationEntries: articleDto,
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
      },
      uploads: quotationManager.uploadedFiles.filter((u) => !!u.upload).map((u) => u.upload)
    };
    const validation = api.quotation.validate(quotation);
    if (validation.message) {
      toast.error(validation.message, { position: validation.position || 'bottom-right' });
    } else {
      updateQuotation({
        quotation,
        files: quotationManager.uploadedFiles.filter((u) => !u.upload).map((u) => u.file)
      });
    }
  };

  const loading =
    isFetchPending ||
    isFetchFirmsPending ||
    isFetchTaxesPending ||
    isFetchCurrenciesPending ||
    isFetchBankAccountsPending ||
    isFetchDefaultConditionPending ||
    isUpdatingPending;

  const { value: debounceLoading } = useDebounce<boolean>(loading, 500);
  if (debounceLoading) return <Spinner className="h-screen" show={true} />;
  return (
    <div className={cn('overflow-auto p-8', className)}>
      {/* Main Container */}
      <div className="block xl:flex gap-4">
        {/* First Card */}
        <div className="w-full h-auto flex flex-col xl:w-9/12">
          <ScrollArea className=" max-h-[calc(100vh-120px)] border rounded-lg">
            <Card className="border-0">
              <CardContent className="p-5">
                <QuotationGeneralInformation
                  className="my-5"
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
                  loading={debounceLoading}
                />
                {/* File Upload & Notes */}
                <QuotationExtraOptions />
                {/* Other Information */}
                <div className="flex gap-10 m-5">
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
                      currency={quotationManager.currency}
                      loading={debounceLoading}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        </div>
        {/* Second Card */}
        <div className="w-full xl:mt-0 xl:w-3/12 ">
          <ScrollArea className=" max-h-[calc(100vh-120px)] border rounded-lg">
            <Card className="border-0 ">
              <CardContent className="p-5">
                <QuotationControlSection
                  status={quotationManager.status}
                  isDataAltered={_.isEqual(initialData, {
                    quotation: quotationManager.getQuotation(),
                    articles: articleStore.getArticles(),
                    controls: controlManager.getControls()
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
                  loading={debounceLoading}
                  reset={globalReset}
                />
              </CardContent>
            </Card>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

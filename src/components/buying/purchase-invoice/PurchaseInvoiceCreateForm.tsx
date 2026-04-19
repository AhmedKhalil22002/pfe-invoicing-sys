import React from 'react';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { api } from '@/api';
import { ArticlePurchaseInvoiceEntry, CreatePurchaseInvoiceDto, PURCHASE_INVOICE_STATUS, PURCHASE_QUOTATION_STATUS } from '@/types';
import { Spinner } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import useTax from '@/hooks/content/useTax';
import useFirmChoice from '@/hooks/content/useFirmChoice';
import useBankAccount from '@/hooks/content/useBankAccount';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { DISCOUNT_TYPE } from '@/types/enums/discount-types';
import { usePurchaseInvoiceManager } from './hooks/usePurchaseInvoiceManager';
import { usePurchaseInvoiceArticleManager } from './hooks/usePurchaseInvoiceArticleManager';
import usePurchaseInvoiceSocket from './hooks/usePurchaseInvoiceSocket';
import { useDebounce } from '@/hooks/other/useDebounce';
import { usePurchaseInvoiceControlManager } from './hooks/usePurchaseInvoiceControlManager';
import useCurrency from '@/hooks/content/useCurrency';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import useCabinet from '@/hooks/content/useCabinet';
import { PurchaseInvoiceExtraOptions } from './form/PurchaseInvoiceExtraOptions';
import useDefaultCondition from '@/hooks/content/useDefaultCondition';
import { ACTIVITY_TYPE } from '@/types/enums/activity-type';
import { DOCUMENT_TYPE } from '@/types/enums/document-type';
import { PurchaseInvoiceGeneralConditions } from './form/PurchaseInvoiceGeneralConditions';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import usePurchaseQuotationChoices from '@/hooks/content/usePurchaseQuotationChoice';
import { PurchaseInvoiceGeneralInformation } from './form/PurchaseInvoiceGeneralInformation';
import { PurchaseInvoiceArticleManagement } from './form/PurchaseInvoiceArticleManagement';
import { PurchaseInvoiceFinancialInformation } from './form/PurchaseInvoiceFinancialInformation';
import { PurchaseInvoiceControlSection } from './form/PurchaseInvoiceControlSection';
import useTaxWithholding from '@/hooks/content/useTaxWitholding';
import dinero from 'dinero.js';
import { createDineroAmountFromFloatWithDynamicCurrency } from '@/utils/money.utils';
import usePurchaseInvoiceRangeDates from '@/hooks/content/usePurchaseInvoiceRangeDates';

interface PurchaseInvoiceFormProps {
  className?: string;
  firmId?: string;
}

export const PurchaseInvoiceCreateForm = ({ className, firmId }: PurchaseInvoiceFormProps) => {
  //next-router
  const router = useRouter();

  //translations
  const { t: tCommon, ready: commonReady } = useTranslation('common');
  const { t: tInvoicing, ready: invoicingReady } = useTranslation('invoicing');

  // Stores
  const purchaseInvoiceManager = usePurchaseInvoiceManager();
  const articleManager = usePurchaseInvoiceArticleManager();
  const controlManager = usePurchaseInvoiceControlManager();

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
     setRoutes?.(
      !firmId
        ? [
            { title: tCommon('menu.buying'), href: '/buying' },
            { title: tInvoicing('purchaseInvoice.plural'), href: '/buying/invoices' },
            { title: tInvoicing('purchaseInvoice.new') }
          ]
        : [
            { title: tCommon('menu.contacts'), href: '/contacts' },
            { title: 'Entreprises', href: '/contacts/firms' },
            {
              title: `Entreprise N°${firmId}`,
              href: `/contacts/firm/${firmId}?tab=entreprise`
            },
            { title: 'Nouvelle Facture' }
          ]
    );
  }, [router.locale, firmId]);

  // Fetch options
  const { firms, isFetchFirmsPending } = useFirmChoice([
    'interlocutorsToFirm',
    'interlocutorsToFirm.interlocutor',
    'paymentCondition',
    'invoicingAddress',
    'deliveryAddress',
    'currency'
  ]);
  const { purchaseQuotations, isFetchPurchaseQuotationPending } = usePurchaseQuotationChoices(PURCHASE_QUOTATION_STATUS.Validated);
  const { cabinet, isFetchCabinetPending } = useCabinet();
  const { taxes, isFetchTaxesPending } = useTax();
  const { currencies, isCurrenciesPending } = useCurrency();
  const { bankAccounts, isFetchBankAccountsPending } = useBankAccount();
  const { defaultCondition, isFetchDefaultConditionPending } = useDefaultCondition(
    ACTIVITY_TYPE.BUYING,
    DOCUMENT_TYPE.PURCHASE_INVOICE
  );
  const { taxWithholdings, isFetchTaxWithholdingsPending } = useTaxWithholding();
  const { dateRange, isFetchPurchaseInvoiceRangePending } = usePurchaseInvoiceRangeDates(purchaseInvoiceManager.id);
  //websocket to listen for server changes related to sequence number
    const { currentSequence, isSequencePending, refetchSequence } = usePurchaseInvoiceSocket();

  //handle Sequential Number
  React.useEffect(() => {
    purchaseInvoiceManager.set('sequentialNumber', currentSequence);
    purchaseInvoiceManager.set(
      'bankAccount',
      bankAccounts.find((a) => a.isMain)
    );
    purchaseInvoiceManager.set('currency', cabinet?.currency);
  }, [currentSequence]);

  // perform calculations when the financialy Information are changed
  const digitAfterComma = React.useMemo(() => {
    return purchaseInvoiceManager.currency?.digitAfterComma || 3;
  }, [purchaseInvoiceManager.currency]);
  React.useEffect(() => {
    const zero = dinero({ amount: 0, precision: digitAfterComma });
    const articles = articleManager.getArticles() || [];
    const subTotal = articles?.reduce((acc, article) => {
      return acc.add(
        dinero({
          amount: createDineroAmountFromFloatWithDynamicCurrency(
            article?.subTotal || 0,
            digitAfterComma
          ),
          precision: digitAfterComma
        })
      );
    }, zero);
    purchaseInvoiceManager.set('subTotal', subTotal.toUnit());
    // Calculate total
    const total = articles?.reduce(
      (acc, article) =>
        acc.add(
          dinero({
            amount: createDineroAmountFromFloatWithDynamicCurrency(
              article?.total || 0,
              digitAfterComma
            ),
            precision: digitAfterComma
          })
        ),
      zero
    );

    let finalTotal = total;
    // Apply discount
    if (purchaseInvoiceManager.discountType === DISCOUNT_TYPE.PERCENTAGE) {
      const discountAmount = total.multiply(purchaseInvoiceManager.discount / 100);
      finalTotal = total.subtract(discountAmount);
    } else {
      const discountAmount = dinero({
        amount: createDineroAmountFromFloatWithDynamicCurrency(
          purchaseInvoiceManager?.discount || 0,
          digitAfterComma
        ),
        precision: digitAfterComma
      });
      finalTotal = total.subtract(discountAmount);
    }
    // Apply tax stamp if applicable
    if (purchaseInvoiceManager.taxStampId) {
      const tax = taxes.find((t) => t.id === purchaseInvoiceManager.taxStampId);
      if (tax) {
        const taxAmount = dinero({
          amount: createDineroAmountFromFloatWithDynamicCurrency(tax.value || 0, digitAfterComma),
          precision: digitAfterComma
        });
        finalTotal = finalTotal.add(taxAmount);
      }
    }
    purchaseInvoiceManager.set('total', finalTotal.toUnit());
  }, [
    articleManager.articles,
    purchaseInvoiceManager.discount,
    purchaseInvoiceManager.discountType,
    purchaseInvoiceManager.taxStampId
  ]);

  //create purchaseInvoice mutator
  const { mutate: createPurchaseInvoice, isPending: isCreatePending } = useMutation({
    mutationFn: (data: { purchaseInvoice: CreatePurchaseInvoiceDto; files: File[] }) =>
      api.purchaseInvoice.create(data.purchaseInvoice, data.files),
    onSuccess: () => {
      if (!firmId) router.push('/buying/invoices');
      else router.push(`/contacts/firm/${firmId}/?tab=purchaseInvoices`);
      toast.success('Facture crée avec succès');
      globalReset();
    },
    onError: (error) => {
      const message = getErrorMessage('invoicing', error, 'Erreur lors de la création de facture');
      toast.error(message);
    }
  });
  const loading =
    isFetchFirmsPending ||
    isFetchTaxesPending ||
    isFetchCabinetPending ||
    isFetchBankAccountsPending ||
    isCurrenciesPending ||
    isFetchDefaultConditionPending ||
    isCreatePending ||
    isFetchPurchaseQuotationPending ||
    isFetchTaxWithholdingsPending ||
    isFetchPurchaseInvoiceRangePending ||
    !commonReady ||
    !invoicingReady;
  const { value: debounceLoading } = useDebounce<boolean>(loading, 500);

  //Reset Form
  const globalReset = () => {
    purchaseInvoiceManager.reset();
    articleManager.reset();
    controlManager.reset();
  };
  //side effect to reset the form when the component is mounted
  React.useEffect(() => {
    globalReset();
    articleManager.add();
  }, []);

  //create handler
  const onSubmit = (status: PURCHASE_INVOICE_STATUS) => {
    const articlesDto: any[] = articleManager.getArticles()?.map((article) => ({
      articleId: article?.articleId,
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
      taxes: article?.articlePurchaseInvoiceEntryTaxes?.map((entry: any) => {
        return entry?.tax?.id;
      })
    }));
    const purchaseInvoice: CreatePurchaseInvoiceDto = {
      date: purchaseInvoiceManager?.date?.toString(),
      dueDate: purchaseInvoiceManager?.dueDate?.toString(),
      object: purchaseInvoiceManager?.object,
      firmId: purchaseInvoiceManager?.firm?.id,
      interlocutorId: purchaseInvoiceManager?.interlocutor?.id,
      currencyId: purchaseInvoiceManager?.currency?.id,
      bankAccountId: !controlManager?.isBankAccountDetailsHidden
        ? purchaseInvoiceManager?.bankAccount?.id
        : undefined,
      status,
      generalConditions: !controlManager.isGeneralConditionsHidden
        ? purchaseInvoiceManager?.generalConditions
        : '',
      notes: purchaseInvoiceManager?.notes,
      articlePurchaseInvoiceEntries: articlesDto,
      discount: purchaseInvoiceManager?.discount,
      discount_type:
        purchaseInvoiceManager?.discountType === 'PERCENTAGE'
          ? DISCOUNT_TYPE.PERCENTAGE
          : DISCOUNT_TYPE.AMOUNT,
      purchaseQuotationId: purchaseInvoiceManager?.purchaseQuotationId,
      taxStampId: purchaseInvoiceManager?.taxStampId,
      taxWithholdingId: purchaseInvoiceManager?.taxWithholdingId,
      purchaseInvoiceMetaData: {
        showDeliveryAddress: !controlManager?.isDeliveryAddressHidden,
        showPurchaseInvoiceAddress: !controlManager?.isPurchaseInvoiceAddressHidden,
        showArticleDescription: !controlManager?.isArticleDescriptionHidden,
        hasBankingDetails: !controlManager.isBankAccountDetailsHidden,
        hasGeneralConditions: !controlManager.isGeneralConditionsHidden,
        hasTaxWithholding: !controlManager.isTaxWithholdingHidden
      }
    };
    const validation = api.purchaseInvoice.validate(purchaseInvoice, dateRange);
    if (validation.message) {
      toast.error(validation.message);
    } else {
      const finalInvoice = { ...purchaseInvoice };
      if (controlManager.isGeneralConditionsHidden) delete finalInvoice.generalConditions;
      createPurchaseInvoice({
        purchaseInvoice: finalInvoice,
        files: purchaseInvoiceManager.uploadedFiles.filter((u) => !u.upload).map((u) => u.file)
      });
     
    }
  };

  //component representation
  if (debounceLoading) return <Spinner className="h-screen" show={loading} />;
  return (
    <div className={cn('overflow-auto px-10 py-6', className)}>
      {/* Main Container */}
      <div className={cn('block xl:flex gap-4', isCreatePending ? 'pointer-events-none' : '')}>
        {/* First Card */}
        <div className="w-full h-auto flex flex-col xl:w-9/12">
          <ScrollArea className=" max-h-[calc(100vh-120px)] border rounded-lg">
            <Card className="border-0">
              <CardContent className="p-5">
                {/* General Information */}
                <PurchaseInvoiceGeneralInformation
                  className="my-5"
                  firms={firms}
                  isInvoicingAddressHidden={controlManager.isPurchaseInvoiceAddressHidden}
                  isDeliveryAddressHidden={controlManager.isDeliveryAddressHidden}
                  loading={isFetchFirmsPending || isSequencePending}
                />
                {/* Article Management */}
                <PurchaseInvoiceArticleManagement
                  className="my-5"
                  taxes={taxes}
                  isArticleDescriptionHidden={controlManager.isArticleDescriptionHidden}
                />
                {/* File Upload & Notes */}
                <PurchaseInvoiceExtraOptions />
                {/* Other Information */}
                <div className="flex gap-10 mt-5">
                  <PurchaseInvoiceGeneralConditions
                    className="flex flex-col w-2/3 my-auto"
                    isPending={debounceLoading}
                    hidden={controlManager.isGeneralConditionsHidden}
                    defaultCondition={defaultCondition}
                  />
                  <div className="w-1/3 my-auto">
                    {/* Final Financial Information */}
                    <PurchaseInvoiceFinancialInformation
                      subTotal={purchaseInvoiceManager.subTotal}
                      status={PURCHASE_INVOICE_STATUS.Nonexistent}
                      currency={
  purchaseInvoiceManager.currency && purchaseInvoiceManager.currency.id
    ? (purchaseInvoiceManager.currency as any)
    : undefined
}
                      taxes={taxes.filter((tax) => !tax.isRate)}
                      taxWithholdings={taxWithholdings}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>
          </ScrollArea>
        </div>
        {/* Second Card */}
        <div className="w-full xl:mt-0 xl:w-3/12">
          <ScrollArea className=" max-h-[calc(100vh-120px)] border rounded-lg">
            <Card className="border-0">
              <CardContent className="p-5">
                {/* Control Section */}
                <PurchaseInvoiceControlSection
                  bankAccounts={bankAccounts}
                  currencies={currencies as ResponseCurrencyDto[]}
                  purchaseQuotations={purchaseQuotations}
                  taxWithholdings={taxWithholdings}
                  handleSubmitDraft={() => onSubmit(PURCHASE_INVOICE_STATUS.Draft)}
                  handleSubmitValidated={() => onSubmit(PURCHASE_INVOICE_STATUS.Validated)}
                  handleSubmitSent={() => onSubmit(PURCHASE_INVOICE_STATUS.Sent)}
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

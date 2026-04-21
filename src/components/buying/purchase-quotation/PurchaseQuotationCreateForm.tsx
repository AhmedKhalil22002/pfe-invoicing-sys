import React from 'react';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { api } from '@/api';
import { ArticlePurchaseQuotationEntry, PURCHASE_QUOTATION_STATUS } from '@/types';
import { Spinner } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import useTax from '@/hooks/content/useTax';
import useFirmChoice from '@/hooks/content/useFirmChoice';
import useBankAccount from '@/hooks/content/useBankAccount';
import { toast } from 'sonner';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { DISCOUNT_TYPE } from '@/types/enums/discount-types';
import { usePurchaseQuotationManager } from '@/components/buying/purchase-quotation/hooks/usePurchaseQuotationManager';
import { usePurchaseQuotationArticleManager } from './hooks/usePurchaseQuotationArticleManager';
import usePurchaseQuotationSocket from './hooks/usePurchaseQuotationSocket';
import { useDebounce } from '@/hooks/other/useDebounce';
import { usePurchaseQuotationControlManager } from './hooks/usePurchaseQuotationControlManager';
import useCurrency from '@/hooks/content/useCurrency';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import useCabinet from '@/hooks/content/useCabinet';
import { PurchaseQuotationExtraOptions } from './form/PurchaseQuotationExtraOptions';
import useDefaultCondition from '@/hooks/content/useDefaultCondition';
import { ACTIVITY_TYPE } from '@/types/enums/activity-type';
import { DOCUMENT_TYPE } from '@/types/enums/document-type';
import { PurchaseQuotationGeneralConditions } from './form/PurchaseQuotationGeneralConditions';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import { PurchaseQuotationGeneralInformation } from './form/PurchaseQuotationGeneralInformation';
import { PurchaseQuotationArticleManagement } from './form/PurchaseQuotationArticleManagement';
import { PurchaseQuotationFinancialInformation } from './form/PurchaseQuotationFinancialInformation';
import { PurchaseQuotationControlSection } from './form/PurchaseQuotationControlSection';
import dinero from 'dinero.js';
import { createDineroAmountFromFloatWithDynamicCurrency } from '@/utils/money.utils';
import { CreatePurchaseQuotationDto } from '@/types/purchase-quotation';

interface PurchaseQuotationFormProps {
  className?: string;
  firmId?: string;
}

export const PurchaseQuotationCreateForm = ({ className, firmId }: PurchaseQuotationFormProps) => {
  //next-router
  const router = useRouter();

  //translations
  const { t: tCommon, ready: commonReady } = useTranslation('common');
  const { t: tInvoicing, ready: invoicingReady } = useTranslation('invoicing');

  // Stores
  const purchaseQuotationManager = usePurchaseQuotationManager();
  const articleManager = usePurchaseQuotationArticleManager();
  const controlManager = usePurchaseQuotationControlManager();

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes?.(
      !firmId
        ? [
        { title: tCommon('menu.buying'), href: '/buying' },
        { title: tInvoicing('purchase-quotation.plural'), href: '/buying/quotations' },
        { title: tInvoicing('purchase-quotation.new') }
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
  const { cabinet, isFetchCabinetPending } = useCabinet();
  const { taxes, isFetchTaxesPending } = useTax();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { bankAccounts, isFetchBankAccountsPending } = useBankAccount();
  const { defaultCondition, isFetchDefaultConditionPending } = useDefaultCondition(
    ACTIVITY_TYPE.BUYING,
    DOCUMENT_TYPE.PURCHASE_QUOTATION
  );

  //websocket to listen for server changes related to sequence number
  const { currentSequence, isPurchaseQuotationSequencePending } = usePurchaseQuotationSocket();
  //handle Sequential Number
  React.useEffect(() => {
    purchaseQuotationManager.set('sequentialNumber', currentSequence);
    purchaseQuotationManager.set(
      'bankAccount',
      bankAccounts.find((a) => a.isMain)
    );
    purchaseQuotationManager.set('currency', cabinet?.currency);
  }, [currentSequence]);

  // perform calculations when the financialy Information are changed
  const digitAfterComma = React.useMemo(() => {
    return purchaseQuotationManager.currency?.digitAfterComma || 3;
  }, [purchaseQuotationManager.currency]);

  React.useEffect(() => {
    const zero = dinero({ amount: 0, precision: digitAfterComma });
    const articles = articleManager.getArticles() || [];
    // Calculate subTotal
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
    purchaseQuotationManager.set('subTotal', subTotal.toUnit());
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
    if (purchaseQuotationManager.discountType === DISCOUNT_TYPE.PERCENTAGE) {
      const discountAmount = total.multiply(purchaseQuotationManager.discount / 100);
      finalTotal = total.subtract(discountAmount);
    } else {
      const discountAmount = dinero({
        amount: createDineroAmountFromFloatWithDynamicCurrency(
          purchaseQuotationManager?.discount || 0,
          digitAfterComma
        ),
        precision: digitAfterComma
      });
      finalTotal = total.subtract(discountAmount);
    }
    purchaseQuotationManager.set('total', finalTotal.toUnit());
  }, [articleManager.articles, purchaseQuotationManager.discount, purchaseQuotationManager.discountType]);

  //create purchaseQuotation mutator
  const { mutate: createPurchaseQuotation, isPending: isCreatePending } = useMutation({
    mutationFn: (data: { purchaseQuotation: CreatePurchaseQuotationDto; files: File[] }) =>
      api.purchaseQuotation.create(data.purchaseQuotation, data.files),
    onSuccess: () => {
      if (!firmId) router.push('/buying/quotation');
      else router.push(`/contacts/firm/${firmId}/?tab=purchaseQuotations`);
      toast.success('Devis crée avec succès');
    },
    onError: (error) => {
      const message = getErrorMessage('invoicing', error, 'Erreur lors de la création de devis');
      toast.error(message);
    }
  });
  const loading =
    isFetchFirmsPending ||
    isFetchTaxesPending ||
    isFetchCabinetPending ||
    isFetchBankAccountsPending ||
    isFetchCurrenciesPending ||
    isFetchDefaultConditionPending ||
    isPurchaseQuotationSequencePending;
  !commonReady || !invoicingReady || isCreatePending;
  const { value: debounceLoading } = useDebounce<boolean>(loading, 500);

  //Reset Form
  const globalReset = () => {
    purchaseQuotationManager.reset();
    articleManager.reset();
    controlManager.reset();
  };
  //side effect to reset the form when the component is mounted
  React.useEffect(() => {
    globalReset();
    articleManager.add();
  }, []);

  //create handler
  const onSubmit = (status: PURCHASE_QUOTATION_STATUS) => {
    const articlesDto: ArticlePurchaseQuotationEntry[] = articleManager.getArticles()?.map((article) => ({
      id: article?.id,
      article: {
        title: article?.article?.title,
        description: !controlManager.isArticleDescriptionHidden ? article?.article?.description : ''
      },
      quantity: article?.quantity || 0,
      unit_price: article?.unit_price || 0,
      discount: article?.discount || 0,
      discount_type:
        article?.discount_type === 'PERCENTAGE' ? DISCOUNT_TYPE.PERCENTAGE : DISCOUNT_TYPE.AMOUNT,
      taxes: article?.articlePurchaseQuotationEntryTaxes?.map((entry) => {
        return entry?.tax?.id;
      })
    }));
    const purchaseQuotation: CreatePurchaseQuotationDto = {
      date: purchaseQuotationManager?.date?.toISOString(),
      dueDate: purchaseQuotationManager?.dueDate?.toISOString(),

      object: purchaseQuotationManager?.object,
      cabinetId: purchaseQuotationManager?.firm?.cabinetId,
      firmId: purchaseQuotationManager?.firm?.id,
      interlocutorId: purchaseQuotationManager?.interlocutor?.id,
      currencyId: purchaseQuotationManager?.currency?.id,
      bankAccountId: !controlManager?.isBankAccountDetailsHidden
        ? purchaseQuotationManager?.bankAccount?.id
        : undefined,
      status,
      generalConditions: !controlManager.isGeneralConditionsHidden
        ? purchaseQuotationManager?.generalConditions
        : '',
      notes: purchaseQuotationManager?.notes,
      articlePurchaseQuotationEntries: articlesDto,
      discount: purchaseQuotationManager?.discount || 0,
      discount_type:
        purchaseQuotationManager?.discountType === 'PERCENTAGE'
          ? DISCOUNT_TYPE.PERCENTAGE
          : DISCOUNT_TYPE.AMOUNT,
      purchaseQuotationMetaData: {
        showDeliveryAddress: !controlManager?.isDeliveryAddressHidden,
        showInvoiceAddress: !controlManager?.isInvoiceAddressHidden,
        showArticleDescription: !controlManager?.isArticleDescriptionHidden,
        hasBankingDetails: !controlManager.isBankAccountDetailsHidden,
        hasGeneralConditions: !controlManager.isGeneralConditionsHidden
      }
    };
    const validation = api.purchaseQuotation.validate(purchaseQuotation);
    if (validation.message) {
      toast.error(validation.message);
    } else {
      if (controlManager.isGeneralConditionsHidden) delete purchaseQuotation.generalConditions;
      createPurchaseQuotation({
        purchaseQuotation,
        files: purchaseQuotationManager.uploadedFiles.filter((u) => !u.upload).map((u) => u.file)
      });
      globalReset();
    }
  };

  //component representation
  if (debounceLoading) return <Spinner className="h-screen" show={debounceLoading} />;
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
                <PurchaseQuotationGeneralInformation
                  className="my-5"
                  firms={firms}
                  isInvoicingAddressHidden={controlManager.isInvoiceAddressHidden}
                  isDeliveryAddressHidden={controlManager.isDeliveryAddressHidden}
                  loading={debounceLoading}
                />
                {/* Article Management */}
                <PurchaseQuotationArticleManagement
                  className="my-5"
                  taxes={taxes}
                  isArticleDescriptionHidden={controlManager.isArticleDescriptionHidden}
                />
                {/* File Upload & Notes */}
                <PurchaseQuotationExtraOptions />
                {/* Other Information */}
                <div className="flex gap-10 mt-5">
                  <PurchaseQuotationGeneralConditions
                    className="flex flex-col w-2/3 my-auto"
                    isPending={debounceLoading}
                    hidden={controlManager.isGeneralConditionsHidden}
                    defaultCondition={defaultCondition}
                  />
                  <div className="w-1/3 my-auto">
                    {/* Final Financial Information */}
                    <PurchaseQuotationFinancialInformation
                      subTotal={purchaseQuotationManager.subTotal}
                      total={purchaseQuotationManager.total}
                      currency={purchaseQuotationManager.currency}
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
                <PurchaseQuotationControlSection
                  bankAccounts={bankAccounts}
                  currencies={currencies}
                  purchaseInvoices={[]}
                  handleSubmitDraft={() => onSubmit(PURCHASE_QUOTATION_STATUS.Draft)}
                  handleSubmitValidated={() => onSubmit(PURCHASE_QUOTATION_STATUS.Validated)}
                  handleSubmitSent={() => onSubmit(PURCHASE_QUOTATION_STATUS.Sent)}
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

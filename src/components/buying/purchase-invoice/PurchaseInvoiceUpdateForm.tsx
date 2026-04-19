import React from 'react';
import { cn } from '@/lib/utils';
import { api } from '@/api';
import {
  ArticlePurchaseInvoiceEntry,
  PURCHASE_INVOICE_STATUS,
  PurchaseInvoice,
  PurchaseInvoiceUploadedFile,
  PURCHASE_QUOTATION_STATUS,
  UpdatePurchaseInvoiceDto,
  ResponseCurrencyDto
} from '@/types';
import { Spinner } from '@/components/shared';
import { Card, CardContent } from '@/components/ui/card';
import useTax from '@/hooks/content/useTax';
import useFirmChoice from '@/hooks/content/useFirmChoice';
import useBankAccount from '@/hooks/content/useBankAccount';
import { toast } from 'sonner';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { DISCOUNT_TYPE } from '@/types/enums/discount-types';
import { useDebounce } from '@/hooks/other/useDebounce';
import { usePurchaseInvoiceManager } from './hooks/usePurchaseInvoiceManager';
import { usePurchaseInvoiceArticleManager } from './hooks/usePurchaseInvoiceArticleManager';
import { usePurchaseInvoiceControlManager } from './hooks/usePurchaseInvoiceControlManager';
import _ from 'lodash';
import useCurrency from '@/hooks/content/useCurrency';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PurchaseInvoiceExtraOptions } from './form/PurchaseInvoiceExtraOptions';
import { PurchaseInvoiceGeneralConditions } from './form/PurchaseInvoiceGeneralConditions';
import useDefaultCondition from '@/hooks/content/useDefaultCondition';
import { ACTIVITY_TYPE } from '@/types/enums/activity-type';
import { DOCUMENT_TYPE } from '@/types/enums/document-type';
import { useRouter } from 'next/router';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import useInitializedState from '@/hooks/use-initialized-state';
import { usePurchaseQuotationManager } from '../purchase-quotation/hooks/usePurchaseQuotationManager';
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
  purchaseInvoiceId: string;
}

export const PurchaseInvoiceUpdateForm = ({ className, purchaseInvoiceId }: PurchaseInvoiceFormProps) => {
  //next-router
  const router = useRouter();

  //translations
  const { t: tCommon, ready: commonReady } = useTranslation('common');
  const { t: tInvoicing, ready: invoicingReady } = useTranslation('invoicing');

  // Stores
  const purchaseInvoiceManager = usePurchaseInvoiceManager();
  const purchaseQuotationManager = usePurchaseQuotationManager();
  const controlManager = usePurchaseInvoiceControlManager();
  const articleManager = usePurchaseInvoiceArticleManager();

  //Fetch options
  const {
    isPending: isFetchPending,
    data: purchaseInvoiceResp,
    refetch: refetchPurchaseInvoice
  } = useQuery({
    queryKey: ['purchaseInvoice', purchaseInvoiceId],
    queryFn: () => api.purchaseInvoice.findOne(parseInt(purchaseInvoiceId))
  });
  const purchaseInvoice = React.useMemo(() => {
    return purchaseInvoiceResp || null;
  }, [purchaseInvoiceResp]);

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    if (purchaseInvoice?.sequential)
      setRoutes?.([
        { title: tCommon('menu.buying'), href: '/buying' },
        { title: tInvoicing('purchaseInvoice.plural'), href: '/buying/invoices' },
        { title: tInvoicing('purchaseInvoice.singular') + ' N° ' + purchaseInvoice?.sequential }
      ]);
  }, [router.locale, purchaseInvoice?.sequential]);

  //recognize if the form can be edited
  const editMode = React.useMemo(() => {
    const editModeStatuses = [PURCHASE_INVOICE_STATUS.Validated, PURCHASE_INVOICE_STATUS.Draft];
    return purchaseInvoice?.status && editModeStatuses.includes(purchaseInvoice?.status);
  }, [purchaseInvoice]);

  // Fetch options
  const { firms, isFetchFirmsPending } = useFirmChoice([
    'interlocutorsToFirm',
    'interlocutorsToFirm.interlocutor',
    'invoicingAddress',
    'deliveryAddress',
    'currency'
  ]);
  const { purchaseQuotations, isFetchPurchaseQuotationPending } = usePurchaseQuotationChoices(PURCHASE_QUOTATION_STATUS.Validated);
  const { taxes, isFetchTaxesPending } = useTax();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { bankAccounts, isFetchBankAccountsPending } = useBankAccount();
  const { taxWithholdings, isFetchTaxWithholdingsPending } = useTaxWithholding();
  const { defaultCondition, isFetchDefaultConditionPending } = useDefaultCondition(
    ACTIVITY_TYPE.BUYING,
    DOCUMENT_TYPE.PURCHASE_INVOICE
  );
  const { dateRange, isFetchPurchaseInvoiceRangePending } = usePurchaseInvoiceRangeDates(purchaseInvoiceManager.id);
  
  const fetching =
    isFetchPending ||
    isFetchFirmsPending ||
    isFetchTaxesPending ||
    isFetchCurrenciesPending ||
    isFetchBankAccountsPending ||
    isFetchDefaultConditionPending ||
    isFetchPurchaseQuotationPending ||
    isFetchTaxWithholdingsPending ||
    isFetchPurchaseInvoiceRangePending ||
    !commonReady ||
    !invoicingReady;
  const { value: debounceFetching } = useDebounce<boolean>(fetching, 500);

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

  //full purchaseInvoice setter across multiple stores
  const setPurchaseInvoiceData = (data: Partial<PurchaseInvoice & { files: PurchaseInvoiceUploadedFile[] }>) => {
    //purchaseInvoice infos
    data && purchaseInvoiceManager.setPurchaseInvoice(data, firms, bankAccounts);
    data?.purchaseQuotation && purchaseQuotationManager.set('sequential', data?.purchaseQuotation?.sequential);
    //purchaseInvoice meta infos
    controlManager.setControls({
      isBankAccountDetailsHidden: !data?.purchaseInvoiceMetaData?.hasBankingDetails,
      isPurchaseInvoiceAddressHidden: !data?.purchaseInvoiceMetaData?.showPurchaseInvoiceAddress,
      isDeliveryAddressHidden: !data?.purchaseInvoiceMetaData?.showDeliveryAddress,
      isArticleDescriptionHidden: !data?.purchaseInvoiceMetaData?.showArticleDescription,
      isGeneralConditionsHidden: !data?.purchaseInvoiceMetaData?.hasGeneralConditions,
      isTaxStampHidden: !data?.purchaseInvoiceMetaData?.hasTaxStamp,
      isTaxWithholdingHidden: !data?.purchaseInvoiceMetaData?.hasTaxWithholding
    });
    //purchaseInvoice article infos
    articleManager.setArticles(data?.articlePurchaseInvoiceEntries || []);
  };

  //initialized value to detect changement whiie modifying the purchaseInvoice
  const { isDisabled, globalReset } = useInitializedState({
    data: purchaseInvoice || ({} as Partial<PurchaseInvoice & { files: PurchaseInvoiceUploadedFile[] }>),
    getCurrentData: () => {
      return {
        purchaseInvoice: purchaseInvoiceManager.getPurchaseInvoice(),
        articles: articleManager.getArticles(),
        controls: controlManager.getControls()
      };
    },
    setFormData: (data: Partial<PurchaseInvoice & { files: PurchaseInvoiceUploadedFile[] }>) => {
      setPurchaseInvoiceData(data);
    },
    resetData: () => {
      purchaseInvoiceManager.reset();
      articleManager.reset();
      controlManager.reset();
    },
    loading: fetching
  });

  //update purchaseInvoice mutator
  const { mutate: updatePurchaseInvoice, isPending: isUpdatingPending } = useMutation({
    mutationFn: (data: { purchaseInvoice: UpdatePurchaseInvoiceDto; files: File[] }) =>
      api.purchaseInvoice.update(data.purchaseInvoice, data.files),
    onSuccess: () => {
      refetchPurchaseInvoice();
      toast.success('Facture modifié avec succès');
    },
    onError: (error) => {
      const message = getErrorMessage(
        'invoicing',
        error,
        'Erreur lors de la modification de Facture'
      );
      toast.error(message);
    }
  });

  //update handler
  const onSubmit = (status: PURCHASE_INVOICE_STATUS) => {
    const articlesDto: any[] = articleManager.getArticles()?.map((article) => ({
      articleId: article?.articleId,
      article: {
        title: article?.article?.title,
        description: controlManager.isArticleDescriptionHidden ? '' : article?.article?.description
      },
      quantity: article?.quantity || 0,
      unit_price: article?.unit_price || 0,
      discount: article?.discount || 0,
      discount_type:
        article?.discount_type === 'PERCENTAGE' ? DISCOUNT_TYPE.PERCENTAGE : DISCOUNT_TYPE.AMOUNT,
      taxes: article?.articlePurchaseInvoiceEntryTaxes?.map((entry: any) => entry?.tax?.id) || []
    }));
    const purchaseInvoice: UpdatePurchaseInvoiceDto = {
      id: purchaseInvoiceManager?.id,
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
        hasTaxStamp: !controlManager.isTaxStampHidden,
        hasTaxWithholding: !controlManager.isTaxWithholdingHidden
      },
      uploads: purchaseInvoiceManager.uploadedFiles.filter((u) => !!u.upload).map((u) => u.upload)
    };
    const validation = api.purchaseInvoice.validate(purchaseInvoice, dateRange);
    if (validation.message) {
      toast.error(validation.message, { position: validation.position || 'bottom-right' });
    } else {
      updatePurchaseInvoice({
        purchaseInvoice,
        files: purchaseInvoiceManager.uploadedFiles.filter((u) => !u.upload).map((u) => u.file)
      });
    }
  };

  //component representation
  if (debounceFetching) return <Spinner className="h-screen" />;
  return (
    <div className={cn('overflow-auto px-10 py-6', className)}>
      {/* Main Container */}
      <div className={cn('block xl:flex gap-4', isUpdatingPending ? 'pointer-events-none' : '')}>
        {/* First Card */}
        <div className="w-full h-auto flex flex-col xl:w-9/12">
          <ScrollArea className=" max-h-[calc(100vh-120px)] border rounded-lg">
            <Card className="border-0">
              <CardContent className="p-5">
                <PurchaseInvoiceGeneralInformation
                  className="my-5"
                  firms={firms}
                  isInvoicingAddressHidden={controlManager.isPurchaseInvoiceAddressHidden}
                  isDeliveryAddressHidden={controlManager.isDeliveryAddressHidden}
                  edit={editMode}
                  loading={debounceFetching}
                />
                {/* Article Management */}
                <PurchaseInvoiceArticleManagement
                  className="my-5"
                  taxes={taxes}
                  edit={editMode}
                  isArticleDescriptionHidden={controlManager.isArticleDescriptionHidden}
                  loading={debounceFetching}
                />
                {/* File Upload & Notes */}
                <PurchaseInvoiceExtraOptions />
                {/* Other Information */}
                <div className="flex gap-10 m-5">
                  <PurchaseInvoiceGeneralConditions
                    className="flex flex-col w-2/3 my-auto"
                    isPending={debounceFetching}
                    hidden={controlManager.isGeneralConditionsHidden}
                    defaultCondition={defaultCondition}
                    edit={editMode}
                  />
                  <div className="w-1/3 my-auto">
                    {/* Final Financial Information */}
                    <PurchaseInvoiceFinancialInformation
                      subTotal={purchaseInvoiceManager.subTotal}
                      status={purchaseInvoiceManager.status}
                      currency={purchaseInvoiceManager.currency as ResponseCurrencyDto}
                      taxes={taxes.filter((tax) => !tax.isRate)}
                      taxWithholdings={taxWithholdings}
                      loading={debounceFetching}
                      edit={editMode}
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
            <Card className="border-0">
              <CardContent className="p-5">
                <PurchaseInvoiceControlSection
                  status={purchaseInvoiceManager.status}
                  isDataAltered={isDisabled}
                  bankAccounts={bankAccounts}
                  currencies={currencies as ResponseCurrencyDto[]}
                  purchaseQuotations={purchaseQuotations}
                  payments={purchaseInvoice?.payments || []}
                  taxWithholdings={taxWithholdings}
                  handleSubmit={() => onSubmit(purchaseInvoiceManager.status)}
                  handleSubmitDraft={() => onSubmit(PURCHASE_INVOICE_STATUS.Draft)}
                  handleSubmitValidated={() => onSubmit(PURCHASE_INVOICE_STATUS.Validated)}
                  handleSubmitSent={() => onSubmit(PURCHASE_INVOICE_STATUS.Sent)}
                  loading={debounceFetching}
                  reset={globalReset}
                  edit={editMode}
                />
              </CardContent>
            </Card>
          </ScrollArea>
        </div>
      </div>
    </div>
  );
};

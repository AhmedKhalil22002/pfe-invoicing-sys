import React from 'react';
import { cn } from '@/lib/utils';
import { api } from '@/api';
import {
  ArticlePurchaseQuotationEntry,
  PURCHASE_QUOTATION_STATUS,
  PurchaseQuotation,
  PurchaseQuotationUploadedFile,
  UpdatePurchaseQuotationDto
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
import { usePurchaseQuotationManager } from './hooks/usePurchaseQuotationManager';
import { usePurchaseQuotationArticleManager } from './hooks/usePurchaseQuotationArticleManager';
import { usePurchaseQuotationControlManager } from './hooks/usePurchaseQuotationControlManager';
import _ from 'lodash';
import useCurrency from '@/hooks/content/useCurrency';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import { PurchaseQuotationExtraOptions } from './form/PurchaseQuotationExtraOptions';
import { PurchaseQuotationGeneralConditions } from './form/PurchaseQuotationGeneralConditions';
import useDefaultCondition from '@/hooks/content/useDefaultCondition';
import { ACTIVITY_TYPE } from '@/types/enums/activity-type';
import { DOCUMENT_TYPE } from '@/types/enums/document-type';
import { useRouter } from 'next/router';
import { useBreadcrumb } from '@/context/BreadcrumbContext';
import useInitializedState from '@/hooks/use-initialized-state';
import { PurchaseQuotationGeneralInformation } from './form/PurchaseQuotationGeneralInformation';
import { PurchaseQuotationArticleManagement } from './form/PurchaseQuotationArticleManagement';
import { PurchaseQuotationFinancialInformation } from './form/PurchaseQuotationFinancialInformation';
import { PurchaseQuotationControlSection } from './form/PurchaseQuotationControlSection';
import dinero from 'dinero.js';
import { createDineroAmountFromFloatWithDynamicCurrency } from '@/utils/money.utils';

interface PurchaseQuotationFormProps {
  className?: string;
  purchaseQuotationId: string;
}

export const PurchaseQuotationUpdateForm = ({ className, purchaseQuotationId }: PurchaseQuotationFormProps) => {
  //next-router
  const router = useRouter();

  //translations
  const { t: tCommon, ready: commonReady } = useTranslation('common');
  const { t: tInvoicing, ready: invoicingReady } = useTranslation('invoicing');

  // Stores
  const purchaseQuotationManager = usePurchaseQuotationManager();
  const controlManager = usePurchaseQuotationControlManager();
  const articleManager = usePurchaseQuotationArticleManager();

  //Fetch options
  const {
    isPending: isFetchPending,
    data: purchaseQuotationResp,
    refetch: refetchPurchaseQuotation
  } = useQuery({
    queryKey: ['purchaseQuotation', purchaseQuotationId],
    queryFn: () => api.purchaseQuotation.findOne(parseInt(purchaseQuotationId))
  });
  const purchaseQuotation = React.useMemo(() => {
    return purchaseQuotationResp || null;
  }, [purchaseQuotationResp]);

  //set page title in the breadcrumb
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    if (purchaseQuotation?.sequential)
      setRoutes?.([
        { title: tCommon('menu.buying'), href: '/buying' },
        { title: tInvoicing('purchase-quotation.plural'), href: '/buying/quotations' },
        { title: tInvoicing('purchase-quotation.singular') + ' N° ' + purchaseQuotation?.sequential }
      ]);
  }, [router.locale, purchaseQuotation?.sequential]);

  //recognize if the form can be edited
  const editMode = React.useMemo(() => {
    const editModeStatuses = [PURCHASE_QUOTATION_STATUS.Validated, PURCHASE_QUOTATION_STATUS.Draft];
    return purchaseQuotation?.status && editModeStatuses.includes(purchaseQuotation?.status);
  }, [purchaseQuotation]);

  // Fetch options
  const { firms, isFetchFirmsPending } = useFirmChoice([
    'interlocutorsToFirm',
    'interlocutorsToFirm.interlocutor',
    'invoicingAddress',
    'deliveryAddress',
    'currency'
  ]);
  const { taxes, isFetchTaxesPending } = useTax();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { bankAccounts, isFetchBankAccountsPending } = useBankAccount();
  const { defaultCondition, isFetchDefaultConditionPending } = useDefaultCondition(
    ACTIVITY_TYPE.BUYING,
    DOCUMENT_TYPE.PURCHASE_QUOTATION
  );
  const fetching =
    isFetchPending ||
    isFetchFirmsPending ||
    isFetchTaxesPending ||
    isFetchCurrenciesPending ||
    isFetchBankAccountsPending ||
    isFetchDefaultConditionPending ||
    !commonReady ||
    !invoicingReady;
  const { value: debounceFetching } = useDebounce<boolean>(fetching, 500);

  const digitAfterComma = React.useMemo(() => {
    return purchaseQuotationManager.currency?.digitAfterComma || 3;
  }, [purchaseQuotationManager.currency]);

  // perform calculations when the financialy Information are changed
  React.useEffect(() => {
    const zero = dinero({ amount: 0, precision: digitAfterComma });
    // Calculate subTotal
    const subTotal = articleManager.getArticles()?.reduce((acc, article) => {
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
    const total = articleManager.getArticles()?.reduce(
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

  //full purchaseQuotation setter across multiple stores
  const setPurchaseQuotationData = (data: Partial<PurchaseQuotation & { files: PurchaseQuotationUploadedFile[] }>) => {
    //purchaseQuotation infos
    data && purchaseQuotationManager.setPurchaseQuotation(data, firms, bankAccounts);

    //purchaseQuotation meta infos
    controlManager.setControls({
      isBankAccountDetailsHidden: !data?.purchaseQuotationMetaData?.hasBankingDetails,
      isInvoiceAddressHidden: !data?.purchaseQuotationMetaData?.showInvoiceAddress,
      isDeliveryAddressHidden: !data?.purchaseQuotationMetaData?.showDeliveryAddress,
      isArticleDescriptionHidden: !data?.purchaseQuotationMetaData?.showArticleDescription,
      isGeneralConditionsHidden: !data?.purchaseQuotationMetaData?.hasGeneralConditions
    });
    //purchaseQuotation article infos
    articleManager.setArticles(data?.articlePurchaseQuotationEntries || []);
  };

  //initialized value to detect changement whiie modifying the purchaseQuotation
  const { isDisabled, globalReset } = useInitializedState({
    data: purchaseQuotation || ({} as Partial<PurchaseQuotation & { files: PurchaseQuotationUploadedFile[] }>),
    getCurrentData: () => {
      return {
        purchaseQuotation: purchaseQuotationManager.getPurchaseQuotation(),
        articles: articleManager.getArticles(),
        controls: controlManager.getControls()
      };
    },
    setFormData: (data: Partial<PurchaseQuotation & { files: PurchaseQuotationUploadedFile[] }>) => {
      setPurchaseQuotationData(data);
    },
    resetData: () => {
      purchaseQuotationManager.reset();
      articleManager.reset();
      controlManager.reset();
    },
    loading: fetching
  });

  //update purchaseQuotation mutator
  const { mutate: updatePurchaseQuotation, isPending: isUpdatingPending } = useMutation({
    mutationFn: (data: { purchaseQuotation: UpdatePurchaseQuotationDto; files: File[] }) =>
      api.purchaseQuotation.update(data.purchaseQuotation, data.files),
    onSuccess: (data) => {
      if (data.status == PURCHASE_QUOTATION_STATUS.Invoiced) {
        toast.success('Devis facturé avec succès');
        // router.push(`/selling/invoice/${data.invoiceId}`);
      } else {
        toast.success('Devis modifié avec succès');
      }
      refetchPurchaseQuotation();
    },
    onError: (error) => {
      const message = getErrorMessage('contacts', error, 'Erreur lors de la modification de devis');
      toast.error(message);
    }
  });

  //update handler
  const onSubmit = (status: PURCHASE_QUOTATION_STATUS) => {
    const articlesDto: ArticlePurchaseQuotationEntry[] = articleManager.getArticles()?.map((article) => ({
      article: {
        title: article?.article?.title,
        description: controlManager.isArticleDescriptionHidden ? '' : article?.article?.description
      },
      quantity: article?.quantity || 0,
      unit_price: article?.unit_price || 0,
      discount: article?.discount || 0,
      discount_type:
        article?.discount_type === 'PERCENTAGE' ? DISCOUNT_TYPE.PERCENTAGE : DISCOUNT_TYPE.AMOUNT,
      taxes: article?.articlePurchaseQuotationEntryTaxes?.map((entry) => entry?.tax?.id) || []
    }));

    const purchaseQuotation: UpdatePurchaseQuotationDto = {
      id: purchaseQuotationManager?.id,
      date: purchaseQuotationManager?.date?.toISOString(),
      dueDate: purchaseQuotationManager?.dueDate?.toISOString(),
      object: purchaseQuotationManager?.object,
      cabinetId: purchaseQuotationManager?.firm?.cabinetId,
      firmId: purchaseQuotationManager?.firm?.id,
      interlocutorId: purchaseQuotationManager?.interlocutor?.id,
      currencyId: purchaseQuotationManager?.currency?.id,
      bankAccountId: !controlManager?.isBankAccountDetailsHidden
        ? purchaseQuotationManager?.bankAccount?.id
        : null,
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
      },
      uploads: purchaseQuotationManager.uploadedFiles.filter((u) => !!u.upload).map((u) => u.upload)
    };
    const validation = api.purchaseQuotation.validate(purchaseQuotation);
    if (validation.message) {
      toast.error(validation.message, { position: validation.position || 'bottom-right' });
    } else {
      updatePurchaseQuotation({
        purchaseQuotation,
        files: purchaseQuotationManager.uploadedFiles.filter((u) => !u.upload).map((u) => u.file)
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
                <PurchaseQuotationGeneralInformation
                  className="my-5"
                  firms={firms}
                  isInvoicingAddressHidden={controlManager.isInvoiceAddressHidden}
                  isDeliveryAddressHidden={controlManager.isDeliveryAddressHidden}
                  edit={editMode}
                  loading={debounceFetching}
                />
                {/* Article Management */}
                <PurchaseQuotationArticleManagement
                  className="my-5"
                  taxes={taxes}
                  edit={editMode}
                  isArticleDescriptionHidden={controlManager.isArticleDescriptionHidden}
                  loading={debounceFetching}
                />
                {/* File Upload & Notes */}
                <PurchaseQuotationExtraOptions />
                {/* Other Information */}
                <div className="flex gap-10 m-5">
                  <PurchaseQuotationGeneralConditions
                    className="flex flex-col w-2/3 my-auto"
                    isPending={debounceFetching}
                    hidden={controlManager.isGeneralConditionsHidden}
                    defaultCondition={defaultCondition}
                    edit={editMode}
                  />
                  <div className="w-1/3 my-auto">
                    {/* Final Financial Information */}
                    <PurchaseQuotationFinancialInformation
                      subTotal={purchaseQuotationManager.subTotal}
                      total={purchaseQuotationManager.total}
                      currency={purchaseQuotationManager.currency}
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
            <Card className="border-0 ">
              <CardContent className="p-5">
                <PurchaseQuotationControlSection
                  status={purchaseQuotationManager.status}
                  isDataAltered={isDisabled}
                  bankAccounts={bankAccounts}
                  currencies={currencies}
                  purchaseInvoices={purchaseQuotationManager.purchaseInvoices || []}
                  handleSubmit={() => onSubmit(purchaseQuotationManager.status)}
                  handleSubmitDraft={() => onSubmit(PURCHASE_QUOTATION_STATUS.Draft)}
                  handleSubmitValidated={() => onSubmit(PURCHASE_QUOTATION_STATUS.Validated)}
                  handleSubmitSent={() => onSubmit(PURCHASE_QUOTATION_STATUS.Sent)}
                  handleSubmitAccepted={() => onSubmit(PURCHASE_QUOTATION_STATUS.Accepted)}
                  handleSubmitRejected={() => onSubmit(PURCHASE_QUOTATION_STATUS.Rejected)}
                  loading={debounceFetching}
                  refetch={refetchPurchaseQuotation}
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

import React from 'react';
import { cn } from '@/lib/utils';
import { api } from '@/api';
import {
  ArticleInvoiceEntry,
  INVOICE_STATUS,
  Invoice,
  InvoiceUploadedFile,
  QUOTATION_STATUS,
  UpdateInvoiceDto
} from '@/types';
import { Spinner } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import useTax from '@/hooks/content/useTax';
import useFirmChoice from '@/hooks/content/useFirmChoice';
import useBankAccount from '@/hooks/content/useBankAccount';
import {
  InvoiceArticleManagement,
  InvoiceControlSection,
  InvoiceFinancialInformation,
  InvoiceGeneralInformation
} from './form';
import { toast } from 'react-toastify';
import { useMutation, useQuery } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { DISCOUNT_TYPE } from '@/types/enums/discount-types';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useInvoiceManager } from './hooks/useInvoiceManager';
import { useInvoiceArticleManager } from './hooks/useInvoiceArticleManager';
import { useInvoiceControlManager } from './hooks/useInvoiceControlManager';
import _ from 'lodash';
import useCurrency from '@/hooks/content/useCurrency';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import { InvoiceExtraOptions } from './form/InvoiceExtraOptions';
import { InvoiceGeneralConditions } from './form/InvoiceGeneralConditions';
import useDefaultCondition from '@/hooks/content/useDefaultCondition';
import { ACTIVITY_TYPE } from '@/types/enums/activity-type';
import { DOCUMENT_TYPE } from '@/types/enums/document-type';
import { useRouter } from 'next/router';
import { useBreadcrumb } from '@/components/layout/BreadcrumbContext';
import useInitializedState from '@/hooks/use-initialized-state';
import { useQuotationManager } from '../quotation/hooks/useQuotationManager';
import useQuotationChoices from '@/hooks/content/useQuotationChoice';

interface InvoiceFormProps {
  className?: string;
  invoiceId: string;
}

export const InvoiceUpdateForm = ({ className, invoiceId }: InvoiceFormProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');

  //Fetch options
  const {
    isPending: isFetchPending,
    data: invoiceResp,
    refetch: refetchInvoice
  } = useQuery({
    queryKey: ['invoice', invoiceId],
    queryFn: () => api.invoice.findOne(parseInt(invoiceId))
  });

  const invoice = React.useMemo(() => {
    return invoiceResp || null;
  }, [invoiceResp]);

  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    if (invoice?.sequential)
      setRoutes([
        { title: tCommon('menu.selling'), href: '/selling' },
        { title: tInvoicing('invoice.plural'), href: '/selling/invoices' },
        { title: tInvoicing('invoice.singular') + ' N° ' + invoice?.sequential }
      ]);
  }, [router.locale, invoice?.sequential]);

  const { taxes, isFetchTaxesPending } = useTax();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { bankAccounts, isFetchBankAccountsPending } = useBankAccount();
  const { defaultCondition, isFetchDefaultConditionPending } = useDefaultCondition(
    ACTIVITY_TYPE.SELLING,
    DOCUMENT_TYPE.INVOICE
  );

  // Fetch options
  const { firms, isFetchFirmsPending } = useFirmChoice([
    'interlocutorsToFirm',
    'interlocutorsToFirm.interlocutor',
    'invoicingAddress',
    'deliveryAddress',
    'currency'
  ]);
  const { quotations, isFetchQuotationPending } = useQuotationChoices(QUOTATION_STATUS.Invoiced);

  // Stores
  const invoiceManager = useInvoiceManager();
  const quotationManager = useQuotationManager();
  const controlManager = useInvoiceControlManager();
  const articleManager = useInvoiceArticleManager();

  const setInvoiceData = (data: Partial<Invoice & { files: InvoiceUploadedFile[] }>) => {
    //invoice infos
    data && invoiceManager.setInvoice(data, firms, bankAccounts);
    data?.quotation && quotationManager.set('sequential', data?.quotation?.sequential);
    //invoice meta infos
    controlManager.setControls({
      isBankAccountDetailsHidden: !data?.invoiceMetaData?.hasBankingDetails,
      isInvoiceAddressHidden: !data?.invoiceMetaData?.showInvoiceAddress,
      isDeliveryAddressHidden: !data?.invoiceMetaData?.showDeliveryAddress,
      isArticleDescriptionHidden: !data?.invoiceMetaData?.showArticleDescription,
      isGeneralConditionsHidden: !data?.invoiceMetaData?.hasGeneralConditions
    });
    //invoice article infos
    articleManager.setArticles(data?.articleInvoiceEntries || []);
  };

  // perform calculations when the financialy Information are changed
  React.useEffect(() => {
    const subTotal =
      articleManager.getArticles()?.reduce((acc, article) => acc + (article?.subTotal || 0), 0) ||
      0;
    const total =
      articleManager.getArticles()?.reduce((acc, article) => acc + (article?.total || 0), 0) || 0;
    invoiceManager.set('subTotal', subTotal);
    if (invoiceManager.discountType === DISCOUNT_TYPE.PERCENTAGE) {
      invoiceManager.set('total', total * (1 - invoiceManager.discount / 100));
    } else {
      invoiceManager.set('total', total - invoiceManager.discount);
    }
  }, [articleManager.articles, invoiceManager.discount, invoiceManager.discountType]);

  const fetching =
    isFetchPending ||
    isFetchFirmsPending ||
    isFetchTaxesPending ||
    isFetchCurrenciesPending ||
    isFetchBankAccountsPending ||
    isFetchDefaultConditionPending ||
    isFetchQuotationPending;

  const { value: debounceFetching } = useDebounce<boolean>(fetching, 500);

  const { isDisabled, globalReset } = useInitializedState({
    data: invoice || ({} as Partial<Invoice & { files: InvoiceUploadedFile[] }>),
    getCurrentData: () => {
      return {
        invoice: invoiceManager.getInvoice(),
        articles: articleManager.getArticles(),
        controls: controlManager.getControls()
      };
    },
    setFormData: (data: Partial<Invoice & { files: InvoiceUploadedFile[] }>) => {
      setInvoiceData(data);
    },
    resetData: () => {
      invoiceManager.reset();
      articleManager.reset();
      controlManager.reset();
    },
    loading: fetching
  });

  //Update invoice
  const { mutate: updateInvoice, isPending: isUpdatingPending } = useMutation({
    mutationFn: (data: { invoice: UpdateInvoiceDto; files: File[] }) =>
      api.invoice.update(data.invoice, data.files),
    onSuccess: () => {
      refetchInvoice();
      toast.success('Devis modifié avec succès');
    },
    onError: (error) => {
      const message = getErrorMessage('contacts', error, 'Erreur lors de la modification de devis');
      toast.error(message);
    }
  });

  const onSubmit = (status: INVOICE_STATUS) => {
    const articlesDto: ArticleInvoiceEntry[] = articleManager.getArticles()?.map((article) => ({
      article: {
        title: article?.article?.title,
        description: controlManager.isArticleDescriptionHidden ? '' : article?.article?.description
      },
      quantity: article?.quantity || 0,
      unit_price: article?.unit_price || 0,
      discount: article?.discount || 0,
      discount_type:
        article?.discount_type === 'PERCENTAGE' ? DISCOUNT_TYPE.PERCENTAGE : DISCOUNT_TYPE.AMOUNT,
      taxes: article?.articleInvoiceEntryTaxes?.map((entry) => entry?.tax?.id) || []
    }));
    const invoice: UpdateInvoiceDto = {
      id: invoiceManager?.id,
      date: invoiceManager?.date?.toString(),
      dueDate: invoiceManager?.dueDate?.toString(),
      object: invoiceManager?.object,
      cabinetId: invoiceManager?.firm?.cabinetId,
      firmId: invoiceManager?.firm?.id,
      interlocutorId: invoiceManager?.interlocutor?.id,
      currencyId: invoiceManager?.currency?.id,
      bankAccountId: !controlManager?.isBankAccountDetailsHidden
        ? invoiceManager?.bankAccount?.id
        : undefined,
      status,
      generalConditions: !controlManager.isGeneralConditionsHidden
        ? invoiceManager?.generalConditions
        : '',
      notes: invoiceManager?.notes,
      articleInvoiceEntries: articlesDto,
      discount: invoiceManager?.discount,
      discount_type:
        invoiceManager?.discountType === 'PERCENTAGE'
          ? DISCOUNT_TYPE.PERCENTAGE
          : DISCOUNT_TYPE.AMOUNT,
      quotationId: invoiceManager?.quotationId,
      invoiceMetaData: {
        showDeliveryAddress: !controlManager?.isDeliveryAddressHidden,
        showInvoiceAddress: !controlManager?.isInvoiceAddressHidden,
        showArticleDescription: !controlManager?.isArticleDescriptionHidden,
        hasBankingDetails: !controlManager.isBankAccountDetailsHidden,
        hasGeneralConditions: !controlManager.isGeneralConditionsHidden
      },
      uploads: invoiceManager.uploadedFiles.filter((u) => !!u.upload).map((u) => u.upload)
    };
    const validation = api.invoice.validate(invoice);
    if (validation.message) {
      toast.error(validation.message, { position: validation.position || 'bottom-right' });
    } else {
      updateInvoice({
        invoice,
        files: invoiceManager.uploadedFiles.filter((u) => !u.upload).map((u) => u.file)
      });
    }
  };
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
                <InvoiceGeneralInformation
                  className="my-5"
                  firms={firms}
                  isInvoicingAddressHidden={controlManager.isInvoiceAddressHidden}
                  isDeliveryAddressHidden={controlManager.isDeliveryAddressHidden}
                  loading={debounceFetching}
                />
                {/* Article Management */}
                <InvoiceArticleManagement
                  className="my-5"
                  taxes={taxes}
                  isArticleDescriptionHidden={controlManager.isArticleDescriptionHidden}
                  loading={debounceFetching}
                />
                {/* File Upload & Notes */}
                <InvoiceExtraOptions />
                {/* Other Information */}
                <div className="flex gap-10 m-5">
                  <InvoiceGeneralConditions
                    className="flex flex-col w-2/3 my-auto"
                    isPending={debounceFetching}
                    hidden={controlManager.isGeneralConditionsHidden}
                    defaultCondition={defaultCondition}
                  />
                  <div className="w-1/3 my-auto">
                    {/* Final Financial Information */}
                    <InvoiceFinancialInformation
                      subTotal={invoiceManager.subTotal}
                      total={invoiceManager.total}
                      currency={invoiceManager.currency}
                      loading={debounceFetching}
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
                <InvoiceControlSection
                  status={invoiceManager.status}
                  isDataAltered={isDisabled}
                  bankAccounts={bankAccounts}
                  currencies={currencies}
                  quotations={quotations}
                  handleSubmit={() => onSubmit(invoiceManager.status)}
                  handleSubmitDraft={() => onSubmit(INVOICE_STATUS.Draft)}
                  handleSubmitValidated={() => onSubmit(INVOICE_STATUS.Validated)}
                  handleSubmitSent={() => onSubmit(INVOICE_STATUS.Sent)}
                  // handleSubmitAccepted={() => onSubmit(INVOICE_STATUS.Paid)}
                  // handleSubmitRejected={() => onSubmit(INVOICE_STATUS.Unpaid)}
                  loading={debounceFetching}
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

import React from 'react';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { api } from '@/api';
import { ArticleInvoiceEntry, CreateInvoiceDto, INVOICE_STATUS, QUOTATION_STATUS } from '@/types';
import { Spinner } from '@/components/common';
import { Card, CardContent } from '@/components/ui/card';
import useTax from '@/hooks/content/useTax';
import useFirmChoice from '@/hooks/content/useFirmChoice';
import useBankAccount from '@/hooks/content/useBankAccount';
import { toast } from 'react-toastify';
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { DISCOUNT_TYPE } from '@/types/enums/discount-types';
import { useInvoiceManager } from '@/components/selling/invoice/hooks/useInvoiceManager';
import { useInvoiceArticleManager } from './hooks/useInvoiceArticleManager';
import useInvoiceSocket from './hooks/useInvoiceSocket';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useInvoiceControlManager } from './hooks/useInvoiceControlManager';
import useCurrency from '@/hooks/content/useCurrency';
import { useTranslation } from 'react-i18next';
import { ScrollArea } from '@/components/ui/scroll-area';
import useCabinet from '@/hooks/content/useCabinet';
import { InvoiceExtraOptions } from './form/InvoiceExtraOptions';
import useDefaultCondition from '@/hooks/content/useDefaultCondition';
import { ACTIVITY_TYPE } from '@/types/enums/activity-type';
import { DOCUMENT_TYPE } from '@/types/enums/document-type';
import { InvoiceGeneralConditions } from './form/InvoiceGeneralConditions';
import { useBreadcrumb } from '@/components/layout/BreadcrumbContext';
import useQuotationChoices from '@/hooks/content/useQuotationChoice';
import { InvoiceGeneralInformation } from './form/InvoiceGeneralInformation';
import { InvoiceArticleManagement } from './form/InvoiceArticleManagement';
import { InvoiceFinancialInformation } from './form/InvoiceFinancialInformation';
import { InvoiceControlSection } from './form/InvoiceControlSection';
interface InvoiceFormProps {
  className?: string;
  firmId: string;
}

export const InvoiceCreateForm = ({ className, firmId }: InvoiceFormProps) => {
  const router = useRouter();
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');
  const { setRoutes } = useBreadcrumb();
  React.useEffect(() => {
    setRoutes(
      !firmId
        ? [
            { title: tCommon('menu.selling'), href: '/selling' },
            { title: tInvoicing('invoice.plural'), href: '/selling/invoices' },
            { title: tInvoicing('invoice.new') }
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
  const { quotations, isFetchQuotationPending } = useQuotationChoices(QUOTATION_STATUS.Invoiced);

  const { cabinet, isFetchCabinetPending } = useCabinet();
  const { taxes, isFetchTaxesPending } = useTax();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { bankAccounts, isFetchBankAccountsPending } = useBankAccount();
  const { defaultCondition, isFetchDefaultConditionPending } = useDefaultCondition(
    ACTIVITY_TYPE.SELLING,
    DOCUMENT_TYPE.INVOICE
  );

  //websocket to listen for server changes related to sequence number
  const { sequence, isInvoiceSequencePending } = useInvoiceSocket();

  // Stores
  const invoiceManager = useInvoiceManager();
  const articleManager = useInvoiceArticleManager();
  const controlManager = useInvoiceControlManager();
  //handle Sequential Number
  React.useEffect(() => {
    invoiceManager.set('sequentialNumber', sequence);
    invoiceManager.set(
      'bankAccount',
      bankAccounts.find((a) => a.isMain)
    );
    invoiceManager.set('currency', cabinet?.currency);
  }, [sequence]);

  React.useEffect(() => {
    const articles = articleManager.getArticles() || [];
    const subTotal = articles.reduce((acc, article) => acc + (article?.subTotal || 0), 0);
    const total = articles.reduce((acc, article) => acc + (article?.total || 0), 0);
    invoiceManager.set('subTotal', subTotal);
    let finalTotal = total;
    // Apply discount
    if (invoiceManager.discountType === DISCOUNT_TYPE.PERCENTAGE) {
      finalTotal *= 1 - invoiceManager.discount / 100;
    } else {
      finalTotal -= invoiceManager.discount;
    }
    // Apply tax stamp if applicable
    if (invoiceManager.taxStampId) {
      const tax = taxes.find((t) => t.id === invoiceManager.taxStampId);
      if (tax) {
        finalTotal += tax?.value || 0;
      }
    }
    invoiceManager.set('total', finalTotal);
  }, [
    articleManager.articles,
    invoiceManager.discount,
    invoiceManager.discountType,
    invoiceManager.taxStampId
  ]);

  const { mutate: createInvoice, isPending: isCreatePending } = useMutation({
    mutationFn: (data: { invoice: CreateInvoiceDto; files: File[] }) =>
      api.invoice.create(data.invoice, data.files),
    onSuccess: () => {
      if (!firmId) router.push('/selling/invoices');
      else router.push(`/contacts/firm/${firmId}/?tab=invoices`);
      toast.success('Devis crée avec succès');
    },
    onError: (error) => {
      const message = getErrorMessage('', error, 'Erreur lors de la création de devis');
      toast.error(message);
    }
  });

  //Reset Form
  const globalReset = () => {
    invoiceManager.reset();
    articleManager.reset();
    controlManager.reset();
  };

  React.useEffect(() => {
    globalReset();
    articleManager.add();
  }, []);

  const onSubmit = (status: INVOICE_STATUS) => {
    const articlesDto: ArticleInvoiceEntry[] = articleManager.getArticles()?.map((article) => ({
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
      taxes: article?.articleInvoiceEntryTaxes?.map((entry) => {
        return entry?.tax?.id;
      })
    }));
    const invoice: CreateInvoiceDto = {
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
      taxStampId: invoiceManager?.taxStampId,
      invoiceMetaData: {
        showDeliveryAddress: !controlManager?.isDeliveryAddressHidden,
        showInvoiceAddress: !controlManager?.isInvoiceAddressHidden,
        showArticleDescription: !controlManager?.isArticleDescriptionHidden,
        hasBankingDetails: !controlManager.isBankAccountDetailsHidden,
        hasGeneralConditions: !controlManager.isGeneralConditionsHidden
      }
    };
    const validation = api.invoice.validate(invoice);
    if (validation.message) {
      toast.error(validation.message);
    } else {
      if (controlManager.isGeneralConditionsHidden) delete invoice.generalConditions;
      createInvoice({
        invoice,
        files: invoiceManager.uploadedFiles.filter((u) => !u.upload).map((u) => u.file)
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
    isCreatePending ||
    isFetchQuotationPending;
  const { value: debounceLoading } = useDebounce<boolean>(loading, 500);

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
                <InvoiceGeneralInformation
                  className="my-5"
                  firms={firms}
                  isInvoicingAddressHidden={controlManager.isInvoiceAddressHidden}
                  isDeliveryAddressHidden={controlManager.isDeliveryAddressHidden}
                  loading={isFetchFirmsPending || isInvoiceSequencePending}
                />
                {/* Article Management */}
                <InvoiceArticleManagement
                  className="my-5"
                  taxes={taxes}
                  isArticleDescriptionHidden={controlManager.isArticleDescriptionHidden}
                />
                {/* File Upload & Notes */}
                <InvoiceExtraOptions />
                {/* Other Information */}
                <div className="flex gap-10 mt-5">
                  <InvoiceGeneralConditions
                    className="flex flex-col w-2/3 my-auto"
                    isPending={debounceLoading}
                    hidden={controlManager.isGeneralConditionsHidden}
                    defaultCondition={defaultCondition}
                  />
                  <div className="w-1/3 my-auto">
                    {/* Final Financial Information */}
                    <InvoiceFinancialInformation
                      subTotal={invoiceManager.subTotal}
                      total={invoiceManager.total}
                      currency={invoiceManager.currency}
                      taxes={taxes.filter((tax) => !tax.isRate)}
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
                <InvoiceControlSection
                  bankAccounts={bankAccounts}
                  currencies={currencies}
                  quotations={quotations}
                  handleSubmitDraft={() => onSubmit(INVOICE_STATUS.Draft)}
                  handleSubmitValidated={() => onSubmit(INVOICE_STATUS.Validated)}
                  handleSubmitSent={() => onSubmit(INVOICE_STATUS.Sent)}
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

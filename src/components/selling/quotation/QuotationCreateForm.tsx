import React from 'react';
import { useRouter } from 'next/router';
import { cn } from '@/lib/utils';
import { ArticleQuotationEntry, CreateQuotationDto, QUOTATION_STATUS, api } from '@/api';
import { BreadcrumbCommon, Spinner } from '@/components/common';
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
import { useMutation } from '@tanstack/react-query';
import { getErrorMessage } from '@/utils/errors';
import { DISCOUNT_TYPE } from '@/api/enums/discount-types';
import { useQuotationManager } from '@/components/selling/quotation/hooks/useQuotationManager';
import { useQuotationArticleManager } from './hooks/useQuotationArticleManager';
import useQuotationSocket from './hooks/useQuotationSocket';
import { useDebounce } from '@/hooks/other/useDebounce';
import { useQuotationControlManager } from './hooks/useQuotationControlManager';
import useCurrency from '@/hooks/content/useCurrency';
import { useTranslation } from 'react-i18next';

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
    'invoicingAddress',
    'deliveryAddress',
    'currency'
  ]);
  const { taxes, isFetchTaxesPending } = useTax();
  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const { bankAccounts, isFetchBankAccountsPending } = useBankAccount();

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
  }, [sequence]);

  // Watchers
  const discount = quotationManager.discount;
  const discount_type = quotationManager.discountType || DISCOUNT_TYPE.PERCENTAGE;
  const taxStamp = quotationManager.taxStamp || 0;
  const currency = quotationManager.firm?.currency || undefined;

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
    mutationFn: (data: CreateQuotationDto) => api.quotation.create(data),
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

    const data: CreateQuotationDto = {
      date: quotationManager?.date?.toString(),
      dueDate: quotationManager?.dueDate?.toString(),
      object: quotationManager?.object,
      cabinetId: quotationManager?.firm?.cabinetId,
      firmId: quotationManager?.firm?.id,
      interlocutorId: quotationManager?.interlocutor?.id,
      currencyId: currency?.id,
      bankAccountId: !controlManager?.isBankAccountDetailsHidden
        ? quotationManager?.bankAccount?.id
        : undefined,
      status,
      generalConditions: !controlManager.isGeneralConditionsHidden
        ? quotationManager?.generalConditions
        : '',
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
    const validation = api.quotation.validate(data);
    if (validation.message) {
      toast.error(validation.message);
    } else {
      if (controlManager.isTaxStampHidden) delete data.taxStamp;
      if (controlManager.isGeneralConditionsHidden) delete data.generalConditions;
      createQuotation(data);
      globalReset();
    }
  };
  const loading =
    isFetchFirmsPending ||
    isFetchTaxesPending ||
    isFetchBankAccountsPending ||
    isFetchCurrenciesPending ||
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
      <div className="block lg:flex gap-4">
        <div className="w-full lg:w-9/12">
          <Card className="w-full">
            <CardContent className="p-5">
              {/* General Information */}
              <QuotationGeneralInformation
                firms={firms}
                defaultFirmId={firmId}
                isInvoicingAddressHidden={controlManager.isInvoiceAddressHidden}
                isDeliveryAddressHidden={controlManager.isDeliveryAddressHidden}
                loading={isFetchFirmsPending || isQuotationSequencePending}
              />

              {/* Article Management */}
              <QuotationArticleManagement
                className="my-5"
                taxes={taxes}
                isArticleDescriptionHidden={controlManager.isArticleDescriptionHidden}
                currency={currency}
              />

              {/* Other Information */}
              <div className="flex gap-10 mt-5">
                <div className="flex flex-col w-1/2 my-auto">
                  {!controlManager.isGeneralConditionsHidden && (
                    <Textarea
                      placeholder={tInvoicing('quotation.attributes.general_condition')}
                      className="resize-none"
                      value={quotationManager.generalConditions}
                      onChange={(e) => quotationManager.set('generalConditions', e.target.value)}
                    />
                  )}
                  <Button className="mt-3" variant={'secondary'}>
                    {tCommon('add_joints')}
                  </Button>
                </div>
                <div className="w-1/2">
                  {/* Final Financial Information */}
                  <QuotationFinancialInformation
                    isTaxStampHidden={controlManager.isTaxStampHidden}
                    subTotal={quotationManager.subTotal}
                    total={quotationManager.total}
                    currency={currency}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        <div className="w-full mt-5 lg:mt-0 lg:w-3/12">
          <div className="sticky top-0">
            <Card className="w-full">
              <CardContent className="p-5 ">
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
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { api } from '@/api';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fromSequentialObjectToString } from '@/utils/string.utils';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';
import {
  ResponseBankAccountDto,
  ResponseCurrencyDto,
  DuplicatePurchaseInvoiceDto,
  PURCHASE_INVOICE_STATUS,
  PaymentPurchaseInvoiceEntry,
  PurchaseQuotation,
  TaxWithholding
} from '@/types';
import { usePurchaseInvoiceManager } from '../hooks/usePurchaseInvoiceManager';
import { usePurchaseInvoiceArticleManager } from '../hooks/usePurchaseInvoiceArticleManager';
import { usePurchaseInvoiceControlManager } from '../hooks/usePurchaseInvoiceControlManager';
import { useMutation } from '@tanstack/react-query';
import { PurchaseInvoiceActionDialog } from '../dialogs/PurchaseInvoiceActionDialog';
import { PurchaseInvoiceDuplicateDialog } from '../dialogs/PurchaseInvoiceDuplicateDialog';
import { PurchaseInvoiceDownloadDialog } from '../dialogs/PurchaseInvoiceDownloadDialog';
import { PurchaseInvoiceDeleteDialog } from '../dialogs/PurchaseInvoiceDeleteDialog';
import { PURCHASE_INVOICE_LIFECYCLE_ACTIONS } from '@/constants/purchase-invoice.lifecycle';
import { PurchaseInvoicePaymentList } from './PurchaseInvoicePaymentList';
import { Input } from '@/components/ui/input';

interface PurchaseInvoiceLifecycle {
  label: string;
  key: string;
  variant: 'default' | 'outline';
  icon: React.ReactNode;
  onClick?: () => void;
  loading: boolean;
  when: {
    membership: 'IN' | 'OUT';
    set: (PURCHASE_INVOICE_STATUS | undefined)[];
  };
}

interface PurchaseInvoiceControlSectionProps {
  className?: string;
  status?: PURCHASE_INVOICE_STATUS;
  isDataAltered?: boolean;
  bankAccounts: ResponseBankAccountDto[];
  currencies: ResponseCurrencyDto[];
  purchaseQuotations: PurchaseQuotation[];
  payments?: PaymentPurchaseInvoiceEntry[];
  taxWithholdings?: TaxWithholding[];
  handleSubmit?: () => void;
  handleSubmitDraft: () => void;
  handleSubmitValidated: () => void;
  handleSubmitSent: () => void;
  handleSubmitDuplicate?: () => void;
  reset: () => void;
  loading?: boolean;
  edit?: boolean;
}

export const PurchaseInvoiceControlSection = ({
  className,
  status = undefined,
  isDataAltered,
  bankAccounts,
  currencies,
  purchaseQuotations,
  payments = [],
  taxWithholdings,
  handleSubmit,
  handleSubmitDraft,
  handleSubmitValidated,
  handleSubmitSent,
  reset,
  loading,
  edit = true
}: PurchaseInvoiceControlSectionProps) => {
  const router = useRouter();
  const { t: tInvoicing } = useTranslation('invoicing');
  const { t: tCommon } = useTranslation('common');
  const { t: tCurrency } = useTranslation('currency');

  const purchaseInvoiceManager = usePurchaseInvoiceManager();
  const controlManager = usePurchaseInvoiceControlManager();
  const articleManager = usePurchaseInvoiceArticleManager();

  //action dialog
  const [actionDialog, setActionDialog] = React.useState<boolean>(false);
  const [actionName, setActionName] = React.useState<string>();
  const [action, setAction] = React.useState<() => void>(() => {});

  //download dialog
  const [downloadDialog, setDownloadDialog] = React.useState(false);

  //Download PurchaseInvoice
  const { mutate: downloadPurchaseInvoice, isPending: isDownloadPending } = useMutation({
    mutationFn: (data: { id: number; template: string }) =>
      api.purchaseInvoice.download(data.id, data.template),
    onSuccess: () => {
      toast.success(tInvoicing('purchaseInvoice.action_download_success'));
      setDownloadDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('purchaseInvoice.action_download_failure'))
      );
    }
  });

  //duplicate dialog
  const [duplicateDialog, setDuplicateDialog] = React.useState(false);

  //Duplicate PurchaseInvoice
  const { mutate: duplicatePurchaseInvoice, isPending: isDuplicationPending } = useMutation({
    mutationFn: (duplicatePurchaseInvoiceDto: DuplicatePurchaseInvoiceDto) =>
      api.purchaseInvoice.duplicate(duplicatePurchaseInvoiceDto),
    onSuccess: async (data) => {
      toast.success(tInvoicing('purchaseInvoice.action_duplicate_success'));
      await router.push('/buying/invoice/' + data.id);
      setDuplicateDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('purchaseInvoice.action_duplicate_failure'))
      );
    }
  });

  //delete dialog
  const [deleteDialog, setDeleteDialog] = React.useState(false);

  //Delete PurchaseInvoice
  const { mutate: removePurchaseInvoice, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.purchaseInvoice.remove(id),
    onSuccess: () => {
      toast.success(tInvoicing('purchaseInvoice.action_remove_success'));
      router.push('/buying/invoices');
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, tInvoicing('purchaseInvoice.action_remove_failure')));
    }
  });

  const buttonsWithHandlers: PurchaseInvoiceLifecycle[] = [
    {
      ...PURCHASE_INVOICE_LIFECYCLE_ACTIONS.save,
      key: 'save',
      onClick: () => {
        setActionName(tCommon('commands.save'));
        !!handleSubmit &&
          setAction(() => {
            return () => handleSubmit();
          });
        setActionDialog(true);
      },
      loading: false
    },
    {
      ...PURCHASE_INVOICE_LIFECYCLE_ACTIONS.draft,
      key: 'draft',
      onClick: () => {
        setActionName(tCommon('commands.save'));
        !!handleSubmitDraft &&
          setAction(() => {
            return () => handleSubmitDraft();
          });
        setActionDialog(true);
      },
      loading: false
    },
    {
      ...PURCHASE_INVOICE_LIFECYCLE_ACTIONS.validated,
      key: 'validated',
      onClick: () => {
        setActionName(tCommon('commands.validate'));
        !!handleSubmitValidated &&
          setAction(() => {
            return () => handleSubmitValidated();
          });
        setActionDialog(true);
      },
      loading: false
    },
    {
      ...PURCHASE_INVOICE_LIFECYCLE_ACTIONS.sent,
      key: 'sent',
      onClick: () => {
        setActionName(tCommon('commands.send'));
        !!handleSubmitSent &&
          setAction(() => {
            return () => handleSubmitSent();
          });
        setActionDialog(true);
      },
      loading: false
    },
    {
      ...PURCHASE_INVOICE_LIFECYCLE_ACTIONS.duplicate,
      key: 'duplicate',
      onClick: () => {
        setDuplicateDialog(true);
      },
      loading: false
    },
    {
      ...PURCHASE_INVOICE_LIFECYCLE_ACTIONS.download,
      key: 'download',
      onClick: () => setDownloadDialog(true),
      loading: false
    },
    {
      ...PURCHASE_INVOICE_LIFECYCLE_ACTIONS.delete,
      key: 'delete',
      onClick: () => {
        setDeleteDialog(true);
      },
      loading: false
    },
    {
      ...PURCHASE_INVOICE_LIFECYCLE_ACTIONS.reset,
      key: 'reset',
      onClick: () => {
        setActionName(tCommon('commands.initialize'));
        !!reset &&
          setAction(() => {
            return () => reset();
          });
        setActionDialog(true);
      },
      loading: false
    }
  ];
  const sequential = fromSequentialObjectToString(purchaseInvoiceManager.sequentialNumber);
  return (
    <>
      <PurchaseInvoiceActionDialog
        id={purchaseInvoiceManager?.id || 0}
        sequential={sequential}
        action={actionName}
        open={actionDialog}
        callback={action}
        isCallbackPending={loading}
        onClose={() => setActionDialog(false)}
      />
      <PurchaseInvoiceDuplicateDialog
        id={purchaseInvoiceManager?.id || 0}
        sequential={sequential}
        open={duplicateDialog}
        duplicatePurchaseInvoice={(includeFiles: boolean) => {
          purchaseInvoiceManager?.id &&
            duplicatePurchaseInvoice({
              id: purchaseInvoiceManager?.id,
              includeFiles: includeFiles
            });
        }}
        isDuplicationPending={isDuplicationPending}
        onClose={() => setDuplicateDialog(false)}
      />
      <PurchaseInvoiceDownloadDialog
        id={purchaseInvoiceManager?.id || 0}
        open={downloadDialog}
        downloadPurchaseInvoice={(template: string) => {
          purchaseInvoiceManager?.id && downloadPurchaseInvoice({ id: purchaseInvoiceManager?.id, template });
        }}
        isDownloadPending={isDownloadPending}
        onClose={() => setDownloadDialog(false)}
      />
      <PurchaseInvoiceDeleteDialog
        id={purchaseInvoiceManager?.id || 0}
        sequential={fromSequentialObjectToString(purchaseInvoiceManager?.sequentialNumber)}
        open={deleteDialog}
        deletePurchaseInvoice={() => {
          purchaseInvoiceManager?.id && removePurchaseInvoice(purchaseInvoiceManager?.id);
        }}
        isDeletionPending={isDeletePending}
        onClose={() => setDeleteDialog(false)}
      />
      <div className={cn(className)}>
        <div className="flex flex-col border-b w-full gap-2 pb-5">
          {/* purchaseInvoice status */}
          {status && (
            <Label className="text-base my-2 text-center">
              <span className="font-bold">{tInvoicing('purchaseInvoice.attributes.status')} :</span>
              <span className="font-extrabold text-gray-500 mx-2">{tInvoicing(status)}</span>
            </Label>
          )}
          {/* purchaseInvoice lifecycle actions */}
          {buttonsWithHandlers.map((lifecycle: PurchaseInvoiceLifecycle) => {
            const idisplay = lifecycle.when?.set?.includes(status);
            const display = lifecycle.when?.membership == 'IN' ? idisplay : !idisplay;
            const disabled =
              isDataAltered && (lifecycle.key === 'save' || lifecycle.key === 'reset');
            return (
              display && (
                <Button
                  disabled={disabled}
                  variant={lifecycle.variant}
                  key={lifecycle.label}
                  className="flex items-center"
                  onClick={lifecycle.onClick}>
                  {lifecycle.icon}
                  <span className="mx-1">{tCommon(lifecycle.label)}</span>
                  <Spinner className="ml-2" size={'small'} show={lifecycle.loading} />
                </Button>
              )
            );
          })}
        </div>
        {/* associated purchaseQuotation */}
        <div>
          <div className="border-b w-full  mt-5">
            <h1 className="font-bold">{tInvoicing('controls.associate_purchaseQuotation')}</h1>
            <div className="my-4">
              {edit ? (
                <Select
                  key={purchaseInvoiceManager?.purchaseQuotationId || 'purchaseQuotationId'}
                  onValueChange={(e) => {
                    purchaseInvoiceManager.set(
                      'purchaseQuotationId',
                      purchaseQuotations?.find((q) => q.id == parseInt(e))?.id
                    );
                  }}
                  value={purchaseInvoiceManager?.purchaseQuotationId?.toString()}>
                  <SelectTrigger className="my-1 w-full">
                    <SelectValue
                      placeholder={tInvoicing('controls.purchaseQuotation_select_placeholder')}
                    />
                  </SelectTrigger>
                  <SelectContent>
                    {purchaseQuotations?.map((q) => {
                      return (
                        <SelectItem key={q.id} value={q?.id?.toString() || ''}>
                          <span className="font-bold">{q?.sequential}</span>
                        </SelectItem>
                      );
                    })}
                  </SelectContent>
                </Select>
              ) : purchaseInvoiceManager.purchaseQuotationId ? (
                <Input
                  className="font-bold my-4"
                  value={purchaseQuotations.find((q) => q.id == purchaseInvoiceManager.purchaseQuotationId)?.sequential}
                />
              ) : (
                <Label className="flex p-2 items-center justify-center gap-2 underline ">
                  <AlertCircle />
                  {tInvoicing('controls.no_associated_purchaseQuotation')}
                </Label>
              )}
            </div>
          </div>
        </div>

        {/* Payment list */}
        {status &&
          [
            PURCHASE_INVOICE_STATUS.Sent,
            PURCHASE_INVOICE_STATUS.Unpaid,
            PURCHASE_INVOICE_STATUS.Paid,
            PURCHASE_INVOICE_STATUS.PartiallyPaid
          ].includes(status) &&
          payments.length != 0 && (
            <PurchaseInvoicePaymentList className="border-b" payments={payments} currencies={currencies} />
          )}
        <div className="border-b w-full mt-5">
          {/* bank account choices */}
          <div>
            {bankAccounts.length == 0 && !controlManager.isBankAccountDetailsHidden && (
              <div>
                <h1 className="font-bold">{tInvoicing('controls.bank_details')}</h1>
                <Label className="flex p-5 items-center justify-center gap-2 underline ">
                  <AlertCircle />
                  {tInvoicing('controls.no_bank_accounts')}
                </Label>
              </div>
            )}

            {bankAccounts.length != 0 && !controlManager.isBankAccountDetailsHidden && (
              <div>
                <h1 className="font-bold">{tInvoicing('controls.bank_details')}</h1>
                <div className="my-5">
                  <Select
                    key={purchaseInvoiceManager.bankAccount?.id || 'bankAccount'}
                    onValueChange={(e) =>
                      purchaseInvoiceManager.set(
                        'bankAccount',
                        bankAccounts.find((account) => account.id == parseInt(e))
                      )
                    }
                    defaultValue={purchaseInvoiceManager?.bankAccount?.id?.toString() || ''}>
                    <SelectTrigger className="mty1 w-full">
                      <SelectValue placeholder={tInvoicing('controls.bank_select_placeholder')} />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts?.map((account) => {
                        return (
                          <SelectItem key={account.id} value={account?.id?.toString() || ''}>
                            <span className="font-bold">{account?.name}</span> - (
                            {account?.currency?.code && tCurrency(account?.currency?.code)}(
                            {account?.currency?.symbol})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            )}
            {/* currency choices */}
            <div>
              <h1 className="font-bold">{tInvoicing('controls.currency_details')}</h1>
              {edit ? (
                <div>
                  {' '}
                  {currencies.length != 0 && (
                    <div className="my-5">
                      <Select
                        key={purchaseInvoiceManager.currency?.id || 'currency'}
                        onValueChange={(e) => {
                          purchaseInvoiceManager.set(
                            'currency',
                            currencies.find((currency) => currency.id == parseInt(e))
                          );
                        }}
                        defaultValue={purchaseInvoiceManager?.currency?.id?.toString() || ''}>
                        <SelectTrigger className="mty1 w-full">
                          <SelectValue
                            placeholder={tInvoicing('controls.currency_select_placeholder')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies?.map((currency) => {
                            return (
                              <SelectItem key={currency.id} value={currency?.id?.toString() || ''}>
                                {currency?.code && tCurrency(currency?.code)} ({currency.symbol})
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </div>
                  )}
                </div>
              ) : (
                <Input
                  className="font-bold my-4"
                  value={
                    purchaseInvoiceManager.currency &&
                    `${purchaseInvoiceManager.currency?.code && tCurrency(purchaseInvoiceManager.currency?.code)} (${purchaseInvoiceManager?.currency?.symbol})`
                  }
                />
              )}
            </div>
          </div>
        </div>
        <div className={cn('w-full py-5', !controlManager.isTaxWithholdingHidden && 'border-b')}>
          <h1 className="font-bold">{tInvoicing('controls.include_on_purchaseQuotation')}</h1>
          <div className="flex w-full items-center mt-1">
            {/* bank details switch */}
            <Label className="w-full">{tInvoicing('controls.bank_details')}</Label>
            <div className="w-full m-1 text-right">
              <Switch
                onClick={() =>
                  controlManager.set(
                    'isBankAccountDetailsHidden',
                    !controlManager.isBankAccountDetailsHidden
                  )
                }
                {...{ checked: !controlManager.isBankAccountDetailsHidden }}
              />
            </div>
          </div>
          {/* article description switch */}
          <div className="flex w-full items-center mt-1">
            <Label className="w-full">{tInvoicing('controls.article_description')}</Label>
            <div className="w-full m-1 text-right">
              <Switch
                onClick={() => {
                  articleManager.removeArticleDescription();
                  controlManager.set(
                    'isArticleDescriptionHidden',
                    !controlManager.isArticleDescriptionHidden
                  );
                }}
                {...{ checked: !controlManager.isArticleDescriptionHidden }}
              />
            </div>
          </div>
          {/* invoicing address switch */}
          <div className="flex w-full items-center mt-1">
            <Label className="w-full">{tInvoicing('purchaseInvoice.attributes.invoicing_address')}</Label>
            <div className="w-full m-1 text-right">
              <Switch
                onClick={() =>
                  controlManager.set(
                    'isPurchaseInvoiceAddressHidden',
                    !controlManager.isPurchaseInvoiceAddressHidden
                  )
                }
                {...{ checked: !controlManager.isPurchaseInvoiceAddressHidden }}
              />
            </div>
          </div>
          {/* delivery address switch */}
          <div className="flex w-full items-center mt-1">
            <Label className="w-full">{tInvoicing('purchaseInvoice.attributes.delivery_address')}</Label>
            <div className="w-full m-1 text-right">
              <Switch
                onClick={() =>
                  controlManager.set(
                    'isDeliveryAddressHidden',
                    !controlManager.isDeliveryAddressHidden
                  )
                }
                {...{ checked: !controlManager.isDeliveryAddressHidden }}
              />
            </div>
          </div>
          {/* general condition switch */}
          <div className="flex w-full items-center mt-1">
            <Label className="w-full">{tInvoicing('purchaseInvoice.attributes.general_condition')}</Label>
            <div className="w-full m-1 text-right">
              <Switch
                onClick={() => {
                  purchaseInvoiceManager.set('generalConditions', '');
                  controlManager.set(
                    'isGeneralConditionsHidden',
                    !controlManager.isGeneralConditionsHidden
                  );
                }}
                {...{ checked: !controlManager.isGeneralConditionsHidden }}
              />
            </div>
          </div>
          {/* tax stamp */}
          <div className="flex w-full items-center mt-1">
            <Label className="w-full">{tInvoicing('purchaseInvoice.attributes.tax_stamp')}</Label>
            <div className="w-full m-1 text-right">
              <Switch
                onClick={() => {
                  // set taxStampId to null if edit
                  if (edit) purchaseInvoiceManager.set('taxStampId', null);
                  controlManager.set('isTaxStampHidden', !controlManager.isTaxStampHidden);
                }}
                {...{ checked: !controlManager.isTaxStampHidden }}
              />
            </div>
          </div>
          {/* tax stamp */}
          <div className="flex w-full items-center mt-1">
            <Label className="w-full">{tInvoicing('purchaseInvoice.attributes.withholding')}</Label>
            <div className="w-full m-1 text-right">
              <Switch
                onClick={() => {
                  purchaseInvoiceManager.set('taxWithholdingId', null);
                  controlManager.set(
                    'isTaxWithholdingHidden',
                    !controlManager.isTaxWithholdingHidden
                  );
                }}
                {...{ checked: !controlManager.isTaxWithholdingHidden }}
              />
            </div>
          </div>
        </div>
        {!controlManager.isTaxWithholdingHidden && (
          <div className="w-full py-5">
            <h1 className="font-bold">{tInvoicing('controls.withholding')}</h1>
            <div className="my-4">
              <Select
                key={purchaseInvoiceManager?.taxWithholdingId || 'taxWithholdingId'}
                onValueChange={(e) => {
                  purchaseInvoiceManager.set('taxWithholdingId', parseInt(e));
                }}
                value={purchaseInvoiceManager?.taxWithholdingId?.toString()}>
                <SelectTrigger className="my-1 w-full">
                  <SelectValue
                    placeholder={tInvoicing('controls.tax_withholding_select_placeholder')}
                  />
                </SelectTrigger>
                <SelectContent>
                  {taxWithholdings?.map((t: TaxWithholding) => {
                    return (
                      <SelectItem key={t.id} value={t?.id?.toString() || ''}>
                        <span className="font-bold">{t?.label}</span> <span>({t?.rate} %)</span>
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
            </div>
          </div>
        )}
      </div>
    </>
  );
};
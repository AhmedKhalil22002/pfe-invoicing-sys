import React from 'react';
import { api } from '@/api';
import { Currency, DuplicatePurchaseQuotationDto, PURCHASE_QUOTATION_STATUS, ResponseBankAccountDto, PurchaseInvoice } from '@/types';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectShimmer,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/shared';
import { usePurchaseQuotationManager } from '@/components/buying/purchase-quotation/hooks/usePurchaseQuotationManager';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fromSequentialObjectToString } from '@/utils/string.utils';
import { PurchaseQuotationDuplicateDialog } from '../dialogs/PurchaseQuotationDuplicateDialog';
import { PurchaseQuotationDownloadDialog } from '../dialogs/PurchaseQuotationDownloadDialog';
import { PurchaseQuotationInvoiceDialog } from '../dialogs/PurchaseQuotationInvoiceDialog';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';
import { PurchaseQuotationDeleteDialog } from '../dialogs/PurchaseQuotationDeleteDialog';
import { usePurchaseQuotationControlManager } from '../hooks/usePurchaseQuotationControlManager';
import { PurchaseQuotationActionDialog } from '../dialogs/PurchaseQuotationActionDialog';
import { usePurchaseQuotationArticleManager } from '../hooks/usePurchaseQuotationArticleManager';
import { PURCHASE_QUOTATION_LIFECYCLE_ACTIONS } from '@/constants/purchase-quotation.lifecycle';
import { Input } from '@/components/ui/input';
import { PurchaseQuotationInvoiceList } from './PurchaseQuotationInvoiceList';

interface PurchaseQuotationLifecycle {
  label: string;
  key: string;
  variant: 'default' | 'outline';
  icon: React.ReactNode;
  onClick?: () => void;
  loading: boolean;
  when: {
    membership: 'IN' | 'OUT';
    set: (PURCHASE_QUOTATION_STATUS | undefined)[];
  };
}

interface PurchaseQuotationControlSectionProps {
  className?: string;
  status?: PURCHASE_QUOTATION_STATUS;
  isDataAltered?: boolean;
  bankAccounts: ResponseBankAccountDto[];
  currencies: Currency[];
  purchaseInvoices: PurchaseInvoice[];
  handleSubmit?: () => void;
  handleSubmitDraft: () => void;
  handleSubmitValidated: () => void;
  handleSubmitSent: () => void;
  handleSubmitAccepted?: () => void;
  handleSubmitRejected?: () => void;
  handleSubmitInvoiced?: (id: number, createInvoice: boolean) => void;
  reset: () => void;
  refetch?: () => void;
  loading?: boolean;
  edit?: boolean;
}

export const PurchaseQuotationControlSection = ({
  className,
  status = undefined,
  isDataAltered,
  bankAccounts,
  currencies,
  purchaseInvoices,
  handleSubmit,
  handleSubmitDraft,
  handleSubmitValidated,
  handleSubmitSent,
  handleSubmitAccepted,
  handleSubmitRejected,
  handleSubmitInvoiced,
  reset,
  refetch,
  loading,
  edit = true
}: PurchaseQuotationControlSectionProps) => {
  const router = useRouter();
  const { t: tInvoicing } = useTranslation('invoicing');
  const { t: tCommon } = useTranslation('common');
  const { t: tCurrency } = useTranslation('currency');

  const purchaseQuotationManager = usePurchaseQuotationManager();
  const controlManager = usePurchaseQuotationControlManager();
  const articleManager = usePurchaseQuotationArticleManager();

  //action dialog
  const [actionDialog, setActionDialog] = React.useState<boolean>(false);
  const [actionName, setActionName] = React.useState<string>();
  const [action, setAction] = React.useState<() => void>(() => {});

  //download dialog
  const [downloadDialog, setDownloadDialog] = React.useState(false);
  const [invoiceDialog, setInvoiceDialog] = React.useState(false);

  //Download PurchaseQuotation
  const { mutate: downloadPurchaseQuotation, isPending: isDownloadPending } = useMutation({
    mutationFn: (data: { id: number; template: string }) =>
      api.purchaseQuotation.download(data.id, data.template),
    onSuccess: () => {
      toast.success(tInvoicing('purchaseQuotation.action_download_success'));
      setDownloadDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('purchaseQuotation.action_download_failure'))
      );
    }
  });

  //Invoice PurchaseQuotation
  const { mutate: invoicePurchaseQuotation, isPending: isInvoicePending } = useMutation({
    mutationFn: (data: { id: number; createInvoice: boolean }) =>
      api.purchaseQuotation.invoice(data.id, data.createInvoice),
    onSuccess: () => {
      toast.success(tInvoicing('purchaseQuotation.action_invoice_success'));
      refetch?.();
      setInvoiceDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('purchaseQuotation.action_invoice_failure'))
      );
    }
  });

  //duplicate dialog
  const [duplicateDialog, setDuplicateDialog] = React.useState(false);

  //Duplicate PurchaseQuotation
  const { mutate: duplicatePurchaseQuotation, isPending: isDuplicationPending } = useMutation({
    mutationFn: (duplicatePurchaseQuotationDto: DuplicatePurchaseQuotationDto) =>
      api.purchaseQuotation.duplicate(duplicatePurchaseQuotationDto),
    onSuccess: async (data) => {
      toast.success(tInvoicing('purchaseQuotation.action_duplicate_success'));
      await router.push('/buying/quotation-portal/' + data.id);
      setDuplicateDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('purchaseQuotation.action_duplicate_failure'))
      );
    }
  });

  //delete dialog
  const [deleteDialog, setDeleteDialog] = React.useState(false);

  //Delete PurchaseQuotation
  const { mutate: removePurchaseQuotation, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.purchaseQuotation.remove(id),
    onSuccess: () => {
      toast.success(tInvoicing('purchaseQuotation.action_remove_success'));
      router.push('/buying/quotation');
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, tInvoicing('purchaseQuotation.action_remove_failure')));
    }
  });


  const buttonsWithHandlers: PurchaseQuotationLifecycle[] = [
    {
      ...PURCHASE_QUOTATION_LIFECYCLE_ACTIONS.save,
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
      ...PURCHASE_QUOTATION_LIFECYCLE_ACTIONS.draft,
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
      ...PURCHASE_QUOTATION_LIFECYCLE_ACTIONS.validated,
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
      ...PURCHASE_QUOTATION_LIFECYCLE_ACTIONS.sent,
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
      ...PURCHASE_QUOTATION_LIFECYCLE_ACTIONS.accepted,
      key: 'accepted',
      onClick: () => {
        setActionName(tCommon('commands.accept'));
        !!handleSubmitAccepted &&
          setAction(() => {
            return () => handleSubmitAccepted();
          });
        setActionDialog(true);
      },
      loading: false
    },
    {
      ...PURCHASE_QUOTATION_LIFECYCLE_ACTIONS.rejected,
      key: 'rejected',
      onClick: () => {
        setActionName(tCommon('commands.reject'));
        !!handleSubmitRejected &&
          setAction(() => {
            return () => handleSubmitRejected();
          });
        setActionDialog(true);
      },
      loading: false
    },
    {
      ...PURCHASE_QUOTATION_LIFECYCLE_ACTIONS.invoiced,
      key: 'invoiced',
      onClick: () => {
        setInvoiceDialog(true);
      },
      loading: false
    },
    {
      ...PURCHASE_QUOTATION_LIFECYCLE_ACTIONS.duplicate,
      key: 'duplicate',
      onClick: () => {
        setDuplicateDialog(true);
      },
      loading: false
    },
    {
      ...PURCHASE_QUOTATION_LIFECYCLE_ACTIONS.download,
      key: 'download',
      onClick: () => setDownloadDialog(true),
      loading: false
    },
    {
      ...PURCHASE_QUOTATION_LIFECYCLE_ACTIONS.delete,
      key: 'delete',
      onClick: () => {
        setDeleteDialog(true);
      },
      loading: false
    },
    {
      ...PURCHASE_QUOTATION_LIFECYCLE_ACTIONS.reset,
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
  const sequential = fromSequentialObjectToString(purchaseQuotationManager.sequentialNumber);
  return (
    <>
      <PurchaseQuotationActionDialog
        id={purchaseQuotationManager?.id || 0}
        sequential={sequential}
        action={actionName}
        open={actionDialog}
        callback={action}
        isCallbackPending={loading}
        onClose={() => setActionDialog(false)}
      />
      <PurchaseQuotationDuplicateDialog
        id={purchaseQuotationManager?.id || 0}
        sequential={sequential}
        open={duplicateDialog}
        duplicatePurchaseQuotation={(includeFiles: boolean) => {
          purchaseQuotationManager?.id &&
            duplicatePurchaseQuotation({
              id: purchaseQuotationManager?.id,
              includeFiles: includeFiles
            });
        }}
        isDuplicationPending={isDuplicationPending}
        onClose={() => setDuplicateDialog(false)}
      />
      <PurchaseQuotationDownloadDialog
        id={purchaseQuotationManager?.id || 0}
        open={downloadDialog}
        downloadPurchaseQuotation={(template: string) => {
          purchaseQuotationManager?.id && downloadPurchaseQuotation({ id: purchaseQuotationManager?.id, template });
        }}
        isDownloadPending={isDownloadPending}
        onClose={() => setDownloadDialog(false)}
      />
      <PurchaseQuotationInvoiceDialog
        id={purchaseQuotationManager?.id || 0}
        status={status || PURCHASE_QUOTATION_STATUS.Draft}
        sequential={sequential}
        open={invoiceDialog}
        invoice={(id: number, createInvoice: boolean) => {
          invoicePurchaseQuotation({ id, createInvoice });
        }}
        isInvoicePending={isInvoicePending}
        onClose={() => setInvoiceDialog(false)}
      />
      <PurchaseQuotationDeleteDialog
        id={purchaseQuotationManager?.id || 0}
        sequential={sequential}
        open={deleteDialog}
        deletePurchaseQuotation={() => {
          purchaseQuotationManager?.id && removePurchaseQuotation(purchaseQuotationManager?.id);
        }}
        isDeletionPending={isDeletePending}
        onClose={() => setDeleteDialog(false)}
      />
      <div className={cn(className)}>
        <div className="flex flex-col border-b w-full gap-2 pb-5">
          {/* purchaseQuotation status */}
          {status && (
            <Label className="text-base my-2 text-center">
              <span className="font-bold">{tInvoicing('purchaseQuotation.attributes.status')} :</span>
              <span className="font-extrabold text-gray-500 ml-2 mr-1">{tInvoicing(status)}</span>
              {status === PURCHASE_QUOTATION_STATUS.Invoiced && purchaseInvoices?.length != 0 && (
                <span className="font-extrabold text-gray-500">({purchaseInvoices?.length})</span>
              )}
            </Label>
          )}
          {/* purchaseQuotation lifecycle actions */}
          {buttonsWithHandlers.map((lifecycle: PurchaseQuotationLifecycle) => {
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
        {/* Invoice list */}
        {status === PURCHASE_QUOTATION_STATUS.Invoiced && purchaseInvoices?.length != 0 && (
          <PurchaseQuotationInvoiceList className="border-b" invoices={purchaseInvoices} />
        )}
        <div className={cn('w-full mt-5 border-b')}>
          {/* bank account choices */}
          <div>
            {!controlManager.isBankAccountDetailsHidden && (
              <React.Fragment>
                {bankAccounts.length == 0 && (
                  <div>
                    <h1 className="font-bold">{tInvoicing('controls.bank_details')}</h1>
                    <Label className="flex p-5 items-center justify-center gap-2 underline ">
                      <AlertCircle />
                      {tInvoicing('controls.no_bank_accounts')}
                    </Label>
                  </div>
                )}
                {bankAccounts.length != 0 && (
                  <div>
                    <h1 className="font-bold">{tInvoicing('controls.bank_details')}</h1>
                    <div className="my-5">
                      <SelectShimmer isPending={loading}>
                        <Select
                          key={purchaseQuotationManager.bankAccount?.id || 'bankAccount'}
                          onValueChange={(e) =>
                            purchaseQuotationManager.set(
                              'bankAccount',
                              bankAccounts.find((account) => account.id == parseInt(e))
                            )
                          }
                          defaultValue={purchaseQuotationManager?.bankAccount?.id?.toString() || ''}>
                          <SelectTrigger className="mty1 w-full">
                            <SelectValue
                              placeholder={tInvoicing('controls.bank_select_placeholder')}
                            />
                          </SelectTrigger>
                          <SelectContent>
                            {bankAccounts?.map((account: ResponseBankAccountDto) => {
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
                      </SelectShimmer>
                    </div>
                  </div>
                )}
              </React.Fragment>
            )}
            {/* currency choices */}
            <h1 className="font-bold">{tInvoicing('controls.currency_details')}</h1>
            {edit ? (
              <div>
                {currencies.length != 0 && (
                  <div className="my-5">
                    <SelectShimmer isPending={loading}>
                      <Select
                        key={purchaseQuotationManager.currency?.id || 'currency'}
                        onValueChange={(e) => {
                          purchaseQuotationManager.set(
                            'currency',
                            currencies.find((currency) => currency.id == parseInt(e))
                          );
                        }}
                        defaultValue={purchaseQuotationManager?.currency?.id?.toString() || ''}>
                        <SelectTrigger className="mty1 w-full">
                          <SelectValue
                            placeholder={tInvoicing('controls.currency_select_placeholder')}
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {currencies?.map((currency: Currency) => {
                            return (
                              <SelectItem key={currency.id} value={currency?.id?.toString() || ''}>
                                {currency?.code && tCurrency(currency?.code)} ({currency.symbol})
                              </SelectItem>
                            );
                          })}
                        </SelectContent>
                      </Select>
                    </SelectShimmer>
                  </div>
                )}
              </div>
            ) : (
               <Input
                className="font-bold my-4"
                value={
                  purchaseQuotationManager.currency &&
                  `${purchaseQuotationManager.currency?.code && tCurrency(purchaseQuotationManager.currency?.code)} (${purchaseQuotationManager?.currency?.symbol})`
                }
                disabled
              />
            )}
          </div>
        </div>
        <div className="w-full py-5">
          <h1 className="font-bold">{tInvoicing('controls.include_on_purchaseQuotation')}</h1>
          <div className="flex w-full items-center mt-1">
            {/* bank details switch */}
            <Label className="w-full">{tInvoicing('controls.bank_details')}</Label>
            <div className="w-full m-1 text-right">
              <Switch
                onClick={() => {
                  controlManager.set(
                    'isBankAccountDetailsHidden',
                    !controlManager.isBankAccountDetailsHidden
                  );
                  purchaseQuotationManager.set('bankAccount', null);
                }}
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
            <Label className="w-full">{tInvoicing('purchaseQuotation.attributes.invoicing_address')}</Label>
            <div className="w-full m-1 text-right">
              <Switch
                onClick={() =>
                  controlManager.set(
                    'isInvoiceAddressHidden',
                    !controlManager.isInvoiceAddressHidden
                  )
                }
                {...{ checked: !controlManager.isInvoiceAddressHidden }}
              />
            </div>
          </div>
          {/* delivery address switch */}
          <div className="flex w-full items-center mt-1">
            <Label className="w-full">{tInvoicing('purchaseQuotation.attributes.delivery_address')}</Label>
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
            <Label className="w-full">{tInvoicing('purchaseQuotation.attributes.general_condition')}</Label>
            <div className="w-full m-1 text-right">
              <Switch
                onClick={() => {
                  purchaseQuotationManager.set('generalConditions', '');
                  controlManager.set(
                    'isGeneralConditionsHidden',
                    !controlManager.isGeneralConditionsHidden
                  );
                }}
                {...{ checked: !controlManager.isGeneralConditionsHidden }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

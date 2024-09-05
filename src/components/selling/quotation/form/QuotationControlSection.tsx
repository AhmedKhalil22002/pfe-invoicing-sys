import React from 'react';
import { BankAccount, Currency, QUOTATION_STATUS, api } from '@/api';
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
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/common';
import { useQuotationManager } from '@/components/selling/quotation/hooks/useQuotationManager';
import QUOTATION_LIFECYCLE_ACTIONS from '../constants/quotation.lifecycle';
import { AlertCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { fromSequentialObjectToString } from '@/utils/string.utils';
import { QuotationDuplicateDialog } from '../dialogs/QuotationDuplicateDialog';
import { QuotationDownloadDialog } from '../dialogs/QuotationDownloadDialog';
import { useMutation } from '@tanstack/react-query';
import { toast } from 'react-toastify';
import { getErrorMessage } from '@/utils/errors';
import { useRouter } from 'next/router';
import { QuotationDeleteDialog } from '../dialogs/QuotationDeleteDialog';
import { useQuotationControlManager } from '../hooks/useQuotationControlManager';
import { QuotationActionDialog } from '../dialogs/QuotationActionDialog';

interface QuotationControlSectionProps {
  className?: string;
  status?: QUOTATION_STATUS;
  isDataAltered?: boolean;
  bankAccounts: BankAccount[];
  currencies: Currency[];
  handleSubmit?: () => void;
  handleSubmitDraft: () => void;
  handleSubmitValidated: () => void;
  handleSubmitSent: () => void;
  handleSubmitAccepted?: () => void;
  handleSubmitRejected?: () => void;
  handleSubmitDuplicate?: () => void;
  reset: () => void;
  loading?: boolean;
}

interface QuotationLifecycle {
  label: string;
  key: string;
  variant: 'default' | 'outline';
  icon: React.ReactNode;
  onClick?: () => void;
  loading: boolean;
  when: {
    membership: 'IN' | 'OUT';
    set: (QUOTATION_STATUS | undefined)[];
  };
}

export const QuotationControlSection = ({
  className,
  status = undefined,
  isDataAltered,
  bankAccounts,
  currencies,
  handleSubmit,
  handleSubmitDraft,
  handleSubmitValidated,
  handleSubmitSent,
  handleSubmitAccepted,
  handleSubmitRejected,
  reset,
  loading
}: QuotationControlSectionProps) => {
  const router = useRouter();
  const { t: tInvoicing } = useTranslation('invoicing');
  const quotationManager = useQuotationManager();
  const controlManager = useQuotationControlManager();

  //action dialog
  const [actionDialog, setActionDialog] = React.useState<boolean>(false);
  const [actionName, setActionName] = React.useState<string>();
  const [action, setAction] = React.useState<() => void>(() => {});

  //download dialog
  const [downloadDialog, setDownloadDialog] = React.useState(false);

  //Download Quotation
  const { mutate: downloadQuotation, isPending: isDownloadPending } = useMutation({
    mutationFn: (data: { id: number; template: string }) =>
      api.quotation.download(data.id, data.template),
    onSuccess: () => {
      toast.success(tInvoicing('quotation.action_download_success'));
      setDownloadDialog(false);
    },
    onError: (error) => {
      toast.error(
        getErrorMessage('invoicing', error, tInvoicing('quotation.action_download_failure')),
      
      );
    }
  });

  //duplicate dialog
  const [duplicateDialog, setDuplicateDialog] = React.useState(false);

  //Duplicate Quotation
  const { mutate: duplicateQuotation, isPending: isDuplicationPending } = useMutation({
    mutationFn: (id: number) => api.quotation.duplicate(id),
    onSuccess: (quotation) => {
      toast.success(tInvoicing('quotation.action_duplicate_success'));
      router.push('/selling/quotation/' + quotation.id);
      setDuplicateDialog(false);
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, tInvoicing('quotation.action_duplicate_failure')));
    }
  });

  //delete dialog
  const [deleteDialog, setDeleteDialog] = React.useState(false);

  //Duplicate Quotation
  const { mutate: removeQuotation, isPending: isDeletePending } = useMutation({
    mutationFn: (id: number) => api.quotation.remove(id),
    onSuccess: () => {
      toast.success(tInvoicing('quotation.action_remove_success'));
      router.push('/selling/quotations');
    },
    onError: (error) => {
      toast.error(getErrorMessage('', error, tInvoicing('quotation.action_remove_failure')));
    }
  });

  const buttonsWithHandlers: QuotationLifecycle[] = [
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.save,
      key: 'save',
      onClick: () => {
        setActionName('Enregister');
        !!handleSubmit &&
          setAction(() => {
            return () => handleSubmit();
          });
        setActionDialog(true);
      },
      loading: false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.draft,
      key: 'draft',
      onClick: () => {
        setActionName('Enregistrer comme Brouillon');
        !!handleSubmitDraft &&
          setAction(() => {
            return () => handleSubmitDraft();
          });
        setActionDialog(true);
      },
      loading: false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.validated,
      key: 'validated',
      onClick: () => {
        setActionName('Valider');
        !!handleSubmitValidated &&
          setAction(() => {
            return () => handleSubmitValidated();
          });
        setActionDialog(true);
      },
      loading: false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.sent,
      key: 'sent',
      onClick: () => {
        setActionName('Envoyer');
        !!handleSubmitSent &&
          setAction(() => {
            return () => handleSubmitSent();
          });
        setActionDialog(true);
      },
      loading: false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.accepted,
      key: 'accepted',
      onClick: () => {
        setActionName('Accepter');
        !!handleSubmitAccepted &&
          setAction(() => {
            return () => handleSubmitAccepted();
          });
        setActionDialog(true);
      },
      loading: false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.rejected,
      key: 'rejected',
      onClick: () => {
        setActionName('Rejeter');
        !!handleSubmitRejected &&
          setAction(() => {
            return () => handleSubmitRejected();
          });
        setActionDialog(true);
      },
      loading: false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.duplicate,
      key: 'duplicate',
      onClick: () => {
        setDuplicateDialog(true);
      },
      loading: false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.print,
      key: 'print',
      onClick: () => setDownloadDialog(true),
      loading: false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.delete,
      key: 'delete',
      onClick: () => {
        setDeleteDialog(true);
      },
      loading: false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.reset,
      key: 'reset',
      onClick: () => {
        setActionName('Initialiser');
        !!reset &&
          setAction(() => {
            return () => reset();
          });
        setActionDialog(true);
      },
      loading: false
    }
  ];
  const sequential = fromSequentialObjectToString(quotationManager.sequentialNumber);
  return (
    <>
      <QuotationActionDialog
        id={quotationManager?.id || 0}
        sequential={sequential}
        action={actionName}
        open={actionDialog}
        callback={action}
        isCallbackPending={loading}
        onClose={() => setActionDialog(false)}
      />
      <QuotationDuplicateDialog
        id={quotationManager?.id || 0}
        sequential={sequential}
        open={duplicateDialog}
        duplicateQuotation={() => {
          quotationManager?.id && duplicateQuotation(quotationManager?.id);
        }}
        isDuplicationPending={isDuplicationPending}
        onClose={() => setDuplicateDialog(false)}
      />
      <QuotationDownloadDialog
        id={quotationManager?.id || 0}
        open={downloadDialog}
        downloadQuotation={(template: string) => {
          quotationManager?.id && downloadQuotation({ id: quotationManager?.id, template });
        }}
        isDownloadPending={isDownloadPending}
        onClose={() => setDownloadDialog(false)}
      />
      <QuotationDeleteDialog
        id={quotationManager?.id || 0}
        sequential={fromSequentialObjectToString(quotationManager?.sequentialNumber)}
        open={deleteDialog}
        deleteQuotation={() => {
          quotationManager?.id && removeQuotation(quotationManager?.id);
        }}
        isDeletionPending={isDeletePending}
        onClose={() => setDeleteDialog(false)}
      />
      <div className={cn(className)}>
        <div className="flex flex-col border-b w-full gap-2 pb-5">
          {status && (
            <Label className="text-base my-2 text-center">
              <span className="font-bold">Status :</span>
              <span className="font-extrabold text-gray-500 mx-2">{tInvoicing(status)}</span>
            </Label>
          )}
          {buttonsWithHandlers.map((lifecycle: QuotationLifecycle) => {
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
                  <span className="mx-1">{lifecycle.label}</span>
                  <Spinner className="ml-2" size={'small'} show={lifecycle.loading} />
                </Button>
              )
            );
          })}
        </div>
        <div className="border-b w-full mt-5">
          <div>
            <h1 className="font-bold">Détails Bancaires</h1>
            {bankAccounts.length == 0 && !controlManager.isBankAccountDetailsHidden && (
              <Label className="flex p-5 items-center justify-center gap-2 underline ">
                <AlertCircle />
                Aucun compte bancaire trouvé
              </Label>
            )}
            {bankAccounts.length != 0 && !controlManager.isBankAccountDetailsHidden && (
              <div className="my-5">
                <SelectShimmer isPending={loading}>
                  <Select
                    key={quotationManager.bankAccount?.id || 'bankAccount'}
                    onValueChange={(e) =>
                      quotationManager.set(
                        'bankAccount',
                        bankAccounts.find((account) => account.id == parseInt(e))
                      )
                    }
                    defaultValue={quotationManager?.bankAccount?.id?.toString() || ''}>
                    <SelectTrigger className="mty1 w-full">
                      <SelectValue placeholder="Choisissez une Compte Bancaire" />
                    </SelectTrigger>
                    <SelectContent>
                      {bankAccounts?.map((account: BankAccount) => {
                        return (
                          <SelectItem key={account.id} value={account?.id?.toString() || ''}>
                            <span className="font-bold">{account?.name}</span> - (
                            {account?.currency?.label} {account?.currency?.symbol})
                          </SelectItem>
                        );
                      })}
                    </SelectContent>
                  </Select>
                </SelectShimmer>
              </div>
            )}
            <div>
              <h1 className="font-bold">Devise</h1>
              {currencies.length != 0 && (
                <div className="my-5">
                  <SelectShimmer isPending={loading}>
                    <Select
                      key={quotationManager.currency?.id || 'currency'}
                      onValueChange={(e) =>
                        quotationManager.set(
                          'currency',
                          currencies.find((currency) => currency.id == parseInt(e))
                        )
                      }
                      defaultValue={quotationManager?.currency?.id?.toString() || ''}>
                      <SelectTrigger className="mty1 w-full">
                        <SelectValue placeholder="Choisissez une Devise" />
                      </SelectTrigger>
                      <SelectContent>
                        {currencies?.map((currency: Currency) => {
                          return (
                            <SelectItem key={currency.id} value={currency?.id?.toString() || ''}>
                              {currency.label} ({currency.symbol})
                            </SelectItem>
                          );
                        })}
                      </SelectContent>
                    </Select>
                  </SelectShimmer>
                </div>
              )}
            </div>
          </div>
        </div>
        <div className="border-b w-full mt-5">
          <h1 className="font-bold">Inclure Sur Le Devis</h1>

          <div className="flex w-full items-center mt-1">
            <Label className="w-full">Détails Bancaires</Label>
            <div className="w-full mx-2 text-right">
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

          <div className="flex w-full items-center mt-1">
            <Label className="w-full">Description Des Articles</Label>
            <div className="w-full mx-2 text-right">
              <Switch
                onClick={() =>
                  controlManager.set(
                    'isArticleDescriptionHidden',
                    !controlManager.isArticleDescriptionHidden
                  )
                }
                {...{ checked: !controlManager.isArticleDescriptionHidden }}
              />
            </div>
          </div>
          <div className="flex w-full items-center mt-1">
            <Label className="w-full">Adresse de Facturation</Label>
            <div className="w-full mx-2 text-right">
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

          <div className="flex w-full items-center mt-1">
            <Label className="w-full">Adresse de Livraison</Label>
            <div className="w-full mx-2 text-right">
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

          <div className="flex w-full items-center mt-1">
            <Label className="w-full">Condition Général</Label>
            <div className="w-full mx-2 text-right">
              <Switch
                onClick={() =>
                  controlManager.set(
                    'isGeneralConditionsHidden',
                    !controlManager.isGeneralConditionsHidden
                  )
                }
                {...{ checked: !controlManager.isGeneralConditionsHidden }}
              />
            </div>
          </div>
        </div>
        <div className="border-b w-full mt-5">
          <h1 className="font-bold">Entrées Supplémentaires</h1>
          <div className="flex w-full items-center mt-1">
            <Label className="w-full">Timbre Fiscal</Label>
            <div className="w-full mx-2 text-right">
              <Switch
                onClick={() =>
                  controlManager.set('isTaxStampHidden', !controlManager.isTaxStampHidden)
                }
                {...{ checked: !controlManager.isTaxStampHidden }}
              />
            </div>
          </div>
        </div>
        <div className="mt-6">
          <Textarea
            placeholder="Remarques"
            className="resize-none"
            value={quotationManager.notes}
            onChange={(e) => quotationManager.set('notes', e.target.value)}
            isPending={loading}
          />
        </div>
      </div>
    </>
  );
};

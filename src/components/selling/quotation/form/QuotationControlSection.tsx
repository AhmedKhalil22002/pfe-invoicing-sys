import React from 'react';
import { BankAccount, QUOTATION_STATUS } from '@/api';
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

interface QuotationControlSectionProps {
  className?: string;
  status?: QUOTATION_STATUS;
  toggleInvoicingAddress: () => void;
  toggleDeliveryAddress: () => void;
  toggleTaxStamp: () => void;
  toggleGeneralConditions: () => void;
  toggleBankAccountHidden: () => void;
  toggleArticleDescriptionHidden: () => void;
  isBankAccountDetailsHidden: boolean;
  bankAccounts: BankAccount[];
  handleSubmitDraft: () => void;
  handleSubmitVerfied: () => void;
  handleSubmitSent: () => void;
  handleSubmitAccepted?: () => void;
  handleSubmitRejected?: () => void;
  handleDuplication?: () => void;
  handlePrinting?: () => void;
  reset: () => void;
  operationLoading?: boolean;
  dataLoading?: boolean;
}

interface QuotationLifecycle {
  label: string;
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
  toggleInvoicingAddress,
  toggleDeliveryAddress,
  toggleTaxStamp,
  toggleGeneralConditions,
  toggleBankAccountHidden,
  toggleArticleDescriptionHidden,
  isBankAccountDetailsHidden,
  bankAccounts,
  handleSubmitDraft,
  handleSubmitVerfied,
  handleSubmitSent,
  handleSubmitAccepted,
  handleSubmitRejected,
  reset,
  operationLoading,
  dataLoading
}: QuotationControlSectionProps) => {
  const { t } = useTranslation('invoicing');
  const quotationManager = useQuotationManager();

  //download dialog
  const [downloadDialog, setDownloadDialog] = React.useState(false);

  //duplicate dialog
  const [duplicateDialog, setDuplicateDialog] = React.useState(false);

  const buttonsWithHandlers: QuotationLifecycle[] = [
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.save,
      onClick: handleSubmitDraft,
      loading: operationLoading || false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.validated,
      onClick: handleSubmitVerfied,
      loading: operationLoading || false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.sent,
      onClick: handleSubmitSent,
      loading: operationLoading || false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.accepted,
      onClick: handleSubmitAccepted,
      loading: operationLoading || false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.rejected,
      onClick: handleSubmitRejected,
      loading: operationLoading || false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.duplicate,
      onClick: () => {
        setDuplicateDialog(true);
      },
      loading: operationLoading || false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.print,
      onClick: () => setDownloadDialog(true),
      loading: operationLoading || false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.reset,
      onClick: reset,
      loading: operationLoading || false
    }
  ];
  const sequential = fromSequentialObjectToString(quotationManager.sequentialNumber);
  return (
    <>
      <QuotationDuplicateDialog
        id={quotationManager?.id || 0}
        sequential={sequential}
        open={duplicateDialog}
        onClose={() => setDuplicateDialog(false)}
      />
      <QuotationDownloadDialog
        id={quotationManager?.id || 0}
        open={downloadDialog}
        onClose={() => setDownloadDialog(false)}
      />
      <div className={cn(className)}>
        <div className="flex flex-col border-b w-full gap-2 pb-5">
          {status && (
            <Label className="text-base my-2 text-center">
              <span className="font-bold">Status :</span>
              <span className="font-extrabold text-gray-500 mx-2">{t(status)}</span>
            </Label>
          )}
          {buttonsWithHandlers.map((lifecycle: QuotationLifecycle) => {
            const idisplay = lifecycle.when?.set?.includes(status);
            const display = lifecycle.when?.membership == 'IN' ? idisplay : !idisplay;
            return (
              display && (
                <Button
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
          <h1 className="font-bold">Inclure Sur Le Devis</h1>

          <div className="flex w-full items-center mt-1">
            <Label className="w-full">Détails Bancaires</Label>
            <div className="w-full mx-2 text-right">
              <Switch onClick={toggleBankAccountHidden} defaultChecked />
            </div>
          </div>
          {bankAccounts.length == 0 && !isBankAccountDetailsHidden && (
            <Label className="flex p-5 items-center justify-center gap-2 underline ">
              <AlertCircle />
              Aucun compte bancaire trouvé
            </Label>
          )}
          {bankAccounts.length != 0 && !isBankAccountDetailsHidden && (
            <div className="my-5">
              <SelectShimmer isPending={dataLoading}>
                <Select
                // onValueChange={(e) => {
                //   field.onChange(e);
                //   const selectedFirm = firms?.find((firm) => firm.mainInterlocutorId === +e);
                //   if (selectedFirm) handleFirmChange(selectedFirm);
                // }}
                // defaultValue={(field.value && field.value.toString()) || ''}
                >
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
          <div className="flex w-full items-center mt-1">
            <Label className="w-full">Description Des Articles</Label>
            <div className="w-full mx-2 text-right">
              <Switch onClick={toggleArticleDescriptionHidden} defaultChecked />
            </div>
          </div>
          <div className="flex w-full items-center mt-1">
            <Label className="w-full">Adresse de Facturation</Label>
            <div className="w-full mx-2 text-right">
              <Switch onClick={toggleInvoicingAddress} defaultChecked />
            </div>
          </div>

          <div className="flex w-full items-center mt-1">
            <Label className="w-full">Adresse de Livraison</Label>
            <div className="w-full mx-2 text-right">
              <Switch onClick={toggleDeliveryAddress} defaultChecked />
            </div>
          </div>

          <div className="flex w-full items-center mt-1">
            <Label className="w-full">Condition Général</Label>
            <div className="w-full mx-2 text-right">
              <Switch onClick={toggleGeneralConditions} defaultChecked />
            </div>
          </div>
        </div>
        <div className="border-b w-full mt-5">
          <h1 className="font-bold">Entrées Supplémentaires</h1>
          <div className="flex w-full items-center mt-1">
            <Label className="w-full">Timbre Fiscal</Label>
            <div className="w-full mx-2 text-right">
              <Switch
                onClick={toggleTaxStamp}
                {...(quotationManager.taxStamp ? { defaultChecked: true } : {})}
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
            isPending={dataLoading}
          />
        </div>
      </div>
    </>
  );
};

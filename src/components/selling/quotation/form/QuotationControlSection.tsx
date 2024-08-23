import React from 'react';
import { BankAccount, CreateQuotationDto, QUOTATION_STATUS } from '@/api';
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
  handleSubmitDuplicate?: () => void;
  handleSubmitVerfied: () => void;
  handleSubmitSent: () => void;
  handleSubmitAccepted?: () => void;
  handleSubmitRejected?: () => void;
  reset: () => void;
  operationLoading?: boolean;
  dataLoading?: boolean;
}

interface QuotationLifecycle {
  label: string;
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
  handleSubmitDuplicate,
  handleSubmitVerfied,
  handleSubmitSent,
  handleSubmitAccepted,
  handleSubmitRejected,
  reset,
  operationLoading,
  dataLoading
}: QuotationControlSectionProps) => {
  const quotationManager = useQuotationManager();

  const buttonsWithHandlers: QuotationLifecycle[] = [
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.reset,
      onClick: reset,
      loading: operationLoading || false
    },
    {
      ...QUOTATION_LIFECYCLE_ACTIONS.draft,
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
      onClick: handleSubmitDuplicate,
      loading: operationLoading || false
    }
  ];
  return (
    <div className={cn(className)}>
      <div className="flex flex-col border-b w-full gap-2 pb-5">
        {buttonsWithHandlers.map((lifecycle: QuotationLifecycle) => {
          const idisplay = lifecycle.when?.set?.includes(status);
          const display = lifecycle.when?.membership == 'IN' ? idisplay : !idisplay;
          return (
            display && (
              <Button
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
  );
};

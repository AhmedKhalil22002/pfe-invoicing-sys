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
import { Check, Copy, File, FilePlus, Send, X } from 'lucide-react';
import { Spinner } from '@/components/common';
import { useQuotationManager } from '@/components/selling/quotation/hooks/useQuotationManager';

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
  reset: () => void;
  operationLoading?: boolean;
  dataLoading?: boolean;
}

interface ButtonConfig {
  label: string;
  icon: React.ReactNode;
  onClick?: () => void;
  loading: boolean;
  when: {
    set: (QUOTATION_STATUS | undefined)[];
    membership: boolean;
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
  reset,
  operationLoading,
  dataLoading
}: QuotationControlSectionProps) => {
  const quotationManager = useQuotationManager();
  const buttons: ButtonConfig[] = [
    {
      label: 'Initialiser',
      icon: <X className="h-5 w-5" />,
      onClick: reset,
      loading: false,
      when: { set: [], membership: false }
    },
    {
      label: 'Brouillon',
      icon: <File className="h-5 w-5" />,
      onClick: handleSubmitDraft,
      loading: operationLoading || false,
      when: { set: [undefined, QUOTATION_STATUS.Draft], membership: true }
    },
    {
      label: 'Dupliquer',
      icon: <Copy className="h-5 w-5" />,
      onClick: handleSubmitDuplicate,
      loading: operationLoading || false,
      when: {
        set: [undefined],
        membership: false
      }
    },
    {
      label: 'Valider',
      icon: <FilePlus className="h-5 w-5" />,
      onClick: handleSubmitVerfied,
      loading: operationLoading || false,
      when: {
        set: [undefined, QUOTATION_STATUS.Draft],
        membership: true
      }
    },
    {
      label: status == QUOTATION_STATUS.Sent ? 'Renvoyer' : 'Envoyer',
      icon: <Send className="h-5 w-5" />,
      onClick: handleSubmitSent,
      loading: operationLoading || false,
      when: {
        set: [QUOTATION_STATUS.Draft, QUOTATION_STATUS.Validated, QUOTATION_STATUS.Sent],
        membership: true
      }
    },
    {
      label: 'Accepter',
      icon: <Check className="h-5 w-5" />,
      onClick: () => {},
      loading: operationLoading || false,
      when: {
        set: [QUOTATION_STATUS.Sent],
        membership: true
      }
    },
    {
      label: 'Refuser',
      icon: <X className="h-5 w-5" />,
      onClick: () => {},
      loading: operationLoading || false,
      when: {
        set: [QUOTATION_STATUS.Sent],
        membership: true
      }
    }
  ];
  return (
    <div className={cn(className)}>
      <div className="flex flex-col border-b w-full gap-2 pb-5">
        {buttons.map((button: ButtonConfig) => {
          const idisplay = button.when?.set?.includes(status) || false;
          const display = button.when?.membership ? idisplay : !idisplay;
          return (
            display && (
              <Button key={button.label} className="flex items-center" onClick={button.onClick}>
                {button.icon}
                <span className="mx-1">{button.label}</span>
                <Spinner className="ml-2" size={'small'} show={button.loading} />
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
        {!isBankAccountDetailsHidden && (
          <div className="mt-2 mb-6">
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

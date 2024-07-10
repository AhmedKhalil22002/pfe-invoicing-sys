import React from 'react';
import { BankAccount, CreateQuotationDto } from '@/api';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { cn } from '@/lib/utils';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { File, FilePlus, Send, X } from 'lucide-react';
import { UseFormRegister } from 'react-hook-form';
import { Spinner } from '@/components/common';

interface QuotationControlSectionProps {
  className?: string;
  // control: Control<CreateQuotationDto, any>;
  // watch: UseFormWatch<CreateQuotationDto>;
  toggleInvoicingAddress: () => void;
  toggleDeliveryAddress: () => void;
  toggleTaxStamp: () => void;
  toggleGeneralConditions: () => void;
  toggleBankAccountHidden: () => void;
  isBankAccountDetailsHidden: boolean;
  bankAccounts: BankAccount[];
  handleSubmitVerfied: () => void;
  handleSubmitDraft: () => void;
  handleSubmitSent: () => void;
  register: UseFormRegister<CreateQuotationDto>;
  reset: () => void;
  //   firms: Firm[];
  //   handleAddressChange: (firm: Firm) => void;
  loading?: boolean;
}

export const QuotationControlSection = ({
  className,
  toggleInvoicingAddress,
  toggleDeliveryAddress,
  toggleTaxStamp,
  toggleGeneralConditions,
  toggleBankAccountHidden,
  isBankAccountDetailsHidden,
  bankAccounts,
  handleSubmitVerfied,
  handleSubmitDraft,
  handleSubmitSent,
  register,
  reset,
  loading
}: QuotationControlSectionProps) => {
  return (
    <div className={cn(className)}>
      <div className="flex flex-col border-b w-full gap-2 pb-5">
        <Button className="flex items-center" onClick={reset}>
          <X className="h-5 w-5" />
          <span className="mx-1">Initialiser</span>
        </Button>
        <Button className="flex items-center" onClick={handleSubmitDraft}>
          <File className="h-5 w-5" />
          <span className="mx-1">Brouillon</span>
          <Spinner className="ml-2" size={'small'} show={loading} />
        </Button>
        <Button className="flex items-center" onClick={handleSubmitVerfied}>
          <FilePlus className="h-5 w-5" />
          <span className="mx-1">Valider</span>
          <Spinner className="ml-2" size={'small'} show={loading} />
        </Button>
        <Button className="flex items-center" onClick={handleSubmitSent}>
          <Send className="h-5 w-5" />
          <span className="mx-1">Envoyer</span>
          <Spinner className="ml-2" size={'small'} show={loading} />
        </Button>
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
          </div>
        )}
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
            <Switch onClick={toggleTaxStamp} />
          </div>
        </div>
      </div>
      <div className="mt-6">
        <Textarea placeholder="Remarques" className="resize-none" {...register('notes')} />
      </div>
    </div>
  );
};

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Currency } from '@/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectShimmer,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import useBankAccountInput from '@/hooks/functions/useBankAccountInput';

interface BankAccountFormProps {
  className?: string;
  bankAccountManager: ReturnType<typeof useBankAccountInput>;
  currencies: Currency[];
  loading?: boolean;
}

export const BankAccountForm = ({
  className,
  bankAccountManager,
  currencies,
  loading
}: BankAccountFormProps) => {
  return (
    <div className={className}>
      <div className="flex gap-2">
        <div className="mt-2 w-2/4">
          <Label>Nom de la Banque(*)</Label>
          <Input
            className="mt-2"
            placeholder="Ex. Al Baraka"
            value={bankAccountManager?.bankAccount?.name}
            onChange={(e) => bankAccountManager.handleBankAccount('name', e.target.value)}
          />
        </div>
        <div className="mt-2 w-1/4">
          <Label>BIC/SWIFT</Label>
          <Input
            className="mt-2 "
            placeholder="Ex. BSTUTNTT"
            value={bankAccountManager?.bankAccount?.bic}
            onChange={(e) => bankAccountManager.handleBankAccount('bic', e.target.value)}
          />
        </div>
        <div className="mt-2 w-1/4">
          <Label>Devise</Label>
          <SelectShimmer isPending={loading || false}>
            <Select
              key={bankAccountManager?.bankAccount?.currency?.id?.toString() || 'currencyID'}
              onValueChange={(e) => bankAccountManager.handleBankAccount('currency', { id: e })}
              value={bankAccountManager.bankAccount?.currency?.id?.toString() || undefined}>
              <SelectTrigger>
                <SelectValue placeholder="Devise" />
              </SelectTrigger>
              <SelectContent>
                {currencies?.map((currency) => (
                  <SelectItem key={currency.id} value={currency?.id?.toString() || ''}>
                    {currency.label} ({currency.symbol})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </SelectShimmer>
        </div>
      </div>
      <div className="flex gap-2">
        <div className="mt-2 w-2/5">
          <Label>R.I.B (*)</Label>
          <Input
            className="mt-2"
            placeholder="Ex. 1234 5678 9012 3456 7890"
            value={bankAccountManager?.bankAccount?.rib}
            onChange={(e) => bankAccountManager.handleBankAccount('rib', e.target.value)}
          />
        </div>
        <div className="mt-2 w-2/5">
          <Label>IBAN (*)</Label>
          <Input
            className="mt-2"
            placeholder="Ex. TN59 1234 5678 9012 3456 7890"
            value={bankAccountManager?.bankAccount?.iban}
            onChange={(e) => bankAccountManager.handleBankAccount('iban', e.target.value)}
          />
        </div>
        <div className="mt-2 w-1/5">
          <Label>Type (*)</Label>

          <div className="flex items-center mt-5">
            <Checkbox
              className="border mx-2"
              onCheckedChange={(e) => bankAccountManager.handleBankAccount('isMain', e)}
              checked={bankAccountManager.bankAccount?.isMain}
            />
            <Label>Banque Principale</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

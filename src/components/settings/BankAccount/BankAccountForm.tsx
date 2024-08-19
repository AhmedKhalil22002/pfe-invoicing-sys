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
import { useBankAccountManager } from './hooks/useBankAccountManager';
import { cn } from '@/lib/utils';
import useCurrency from '@/hooks/content/useCurrency';

interface BankAccountFormProps {
  className?: string;
}

export const BankAccountForm = ({ className }: BankAccountFormProps) => {
  const bankAccountManager = useBankAccountManager();
  const { currencies, isFetchCurrenciesPending } = useCurrency();

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex gap-2">
        <div className="mt-2 w-2/4">
          <Label>Nom de la Banque(*)</Label>
          <Input
            className="mt-2"
            placeholder="Ex. Al Baraka"
            value={bankAccountManager?.name}
            onChange={(e) => bankAccountManager.set('name', e.target.value)}
          />
        </div>
        <div className="mt-2 w-1/4">
          <Label>BIC/SWIFT</Label>
          <Input
            className="mt-2 "
            placeholder="Ex. BSTUTNTT"
            value={bankAccountManager?.bic}
            onChange={(e) => bankAccountManager.set('bic', e.target.value)}
          />
        </div>
        <div className="mt-3 w-1/4">
          <Label>Devise</Label>
          <SelectShimmer isPending={isFetchCurrenciesPending || false}>
            <Select
              key={bankAccountManager?.currency?.id?.toString() || 'currencyId'}
              onValueChange={(e) => bankAccountManager.set('currency', { id: parseInt(e) })}
              value={bankAccountManager?.currency?.id?.toString() || undefined}>
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
            value={bankAccountManager?.rib}
            onChange={(e) => bankAccountManager.set('rib', e.target.value)}
          />
        </div>
        <div className="mt-2 w-2/5">
          <Label>IBAN (*)</Label>
          <Input
            className="mt-2"
            placeholder="Ex. TN59 1234 5678 9012 3456 7890"
            value={bankAccountManager?.iban}
            onChange={(e) => bankAccountManager.set('iban', e.target.value)}
          />
        </div>
        <div className="mt-2 w-1/5">
          <Label>Type (*)</Label>

          <div className="flex items-center mt-5">
            <Checkbox
              className="border mx-2"
              onCheckedChange={(e) => bankAccountManager.set('isMain', e)}
              checked={bankAccountManager?.isMain}
            />
            <Label>Banque Principale</Label>
          </div>
        </div>
      </div>
    </div>
  );
};

import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { BankAccount, CreateBankAccountDto, Currency } from '@/api';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectShimmer,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Control, Controller, Form, UseFormRegister, UseFormWatch } from 'react-hook-form';

interface BankAccountFormProps {
  className?: string;
  register: UseFormRegister<CreateBankAccountDto>;
  control: Control<CreateBankAccountDto, any>;
  watch: UseFormWatch<CreateBankAccountDto>;
  currencies: Currency[];
  loading?: boolean;
}

export const BankAccountForm = ({
  className,
  register,
  control,
  watch,
  currencies,
  loading
}: BankAccountFormProps) => {
  return (
    <div className={className}>
      <Form control={control}>
        <div className="flex gap-2">
          <div className="mt-2 w-2/4">
            <Label>Nom de la Banque(*)</Label>
            <Input className="mt-2" placeholder="Ex. Al Baraka" {...register('name')} />
          </div>
          <div className="mt-2 w-1/4">
            <Label>BIC/SWIFT</Label>
            <Input className="mt-2 " placeholder="Ex. BSTUTNTT" {...register('bic')} />
          </div>
          <div className="mt-2 w-1/4">
            <Label>BIC/SWIFT</Label>
            <Controller
              control={control}
              name="currencyId"
              render={({ field }) => {
                return (
                  <SelectShimmer isPending={loading || false}>
                    <Select
                      onValueChange={(e) => field.onChange({ target: { value: +e } })}
                      value={field.value ? field.value.toString() : ''}>
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
                );
              }}
            />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="mt-2 w-2/5">
            <Label>R.I.B (*)</Label>
            <Input
              className="mt-2"
              placeholder="Ex. 1234 5678 9012 3456 7890"
              {...register('rib')}
            />
          </div>
          <div className="mt-2 w-2/5">
            <Label>IBAN (*)</Label>
            <Input
              className="mt-2"
              placeholder="Ex. TN59 1234 5678 9012 3456 7890"
              {...register('iban')}
            />
          </div>
          <div className="mt-2 w-1/5">
            <Label>Type (*)</Label>
            <Controller
              control={control}
              name="isMain"
              defaultValue={watch('isMain')}
              render={({ field }) => {
                return (
                  <div className="flex items-center mt-5">
                    <Checkbox
                      className="border mx-2"
                      onCheckedChange={(e) => field.onChange(e)}
                      checked={field.value}
                    />
                    <Label>Banque Principale</Label>
                  </div>
                );
              }}
            />
          </div>
        </div>
      </Form>
    </div>
  );
};

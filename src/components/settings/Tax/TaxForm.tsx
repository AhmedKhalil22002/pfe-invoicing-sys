import React from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useTaxManager } from './hooks/useTaxManager';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectShimmer,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { useTranslation } from 'react-i18next';
import useCurrency from '@/hooks/content/useCurrency';
import { Checkbox } from '@/components/ui/checkbox';
import { CheckedState } from '@radix-ui/react-checkbox';
import { cn } from '@/lib/utils';

interface TaxFormProps {
  className?: string;
}

export const TaxForm = ({ className }: TaxFormProps) => {
  const { t: tSettings } = useTranslation('settings');
  const { t: tCommon } = useTranslation('common');
  const { t: tCurrency } = useTranslation('currency');

  const { currencies, isFetchCurrenciesPending } = useCurrency();
  const taxManager = useTaxManager();
  const [showCurrencyInput, setShowCurrencyInput] = React.useState(taxManager?.currencyId !== null);

  const handleShowCurrencyInputs = (checked: CheckedState) => {
    const value = showCurrencyInput ? null : 1;
    setShowCurrencyInput(checked as boolean);
    taxManager.set('currencyId', value);
  };

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      {/* Tax Label */}
      <div>
        <Label htmlFor="tax-label" required>
          {tSettings('tax.attributes.label')}
        </Label>
        <Input
          id="tax-label"
          className="mt-2"
          placeholder="Ex. FODEC"
          name="label"
          value={taxManager?.label}
          onChange={(e) => taxManager.set('label', e.target.value)}
        />
        <Label className="font-thin text-sm mt-1 block">
          {tSettings('tax.attributes.label_description')}
        </Label>
      </div>

      {/* Tax Value and Type */}
      <div className="flex flex-col gap-2">
        <div className="grid grid-cols-4 gap-4">
          {/* Tax Value */}
          <div className="col-span-3">
            <Label htmlFor="tax-value" required>
              {tSettings('tax.attributes.value')}
            </Label>
            <Input
              id="tax-value"
              type="number"
              className="mt-2"
              placeholder="Ex. 10"
              name="rate"
              value={taxManager?.value}
              onChange={(e) => taxManager.set('value', parseFloat(e.target.value))}
            />
          </div>

          {/* Tax Type */}
          <div>
            <Label htmlFor="tax-type" required>
              {tSettings('tax.attributes.type')}
            </Label>
            <Select
              value={taxManager.isRate ? 'PERCENTAGE' : 'AMOUNT'}
              onValueChange={(e) => taxManager.set('isRate', e === 'PERCENTAGE')}>
              <SelectTrigger className="mt-2" id="tax-type">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">%</SelectItem>
                <SelectItem value="AMOUNT">$</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <Label className="font-thin text-sm">{tSettings('tax.attributes.value_description')}</Label>
      </div>

      {/* Special Tax */}
      <div>
        <Label>{tSettings('tax.attributes.is_special')}</Label>
        <RadioGroup
          value={taxManager.isSpecial ? 'YES' : 'NO'}
          onValueChange={(e) => taxManager.set('isSpecial', e === 'YES')}
          className="my-2 flex gap-4">
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="YES" id="special-yes" />
            <Label htmlFor="special-yes">{tCommon('answer.yes')}</Label>
          </div>
          <div className="flex items-center space-x-2">
            <RadioGroupItem value="NO" id="special-no" />
            <Label htmlFor="special-no">{tCommon('answer.no')}</Label>
          </div>
        </RadioGroup>
        <Label className="font-thin text-sm block">
          {tSettings('tax.attributes.is_special_description')}
        </Label>
      </div>
      <div>
        {
          <div className="items-top flex space-x-2 my-4">
            <Checkbox
              id="show-password-inputs"
              checked={showCurrencyInput}
              onCheckedChange={handleShowCurrencyInputs}
            />
            <div className="grid gap-1.5 leading-none">
              <label
                htmlFor="show-password-inputs"
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                {tSettings('tax.attributes.currency_checkbox')}
              </label>
            </div>
          </div>
        }

        {(showCurrencyInput || taxManager.currencyId) && (
          <div>
            <Label required>{tSettings('tax.attributes.currency')}</Label>
            <SelectShimmer isPending={isFetchCurrenciesPending || false}>
              <Select
                key={taxManager?.currencyId?.toString() || 'currencyId'}
                onValueChange={(e) => taxManager.set('currencyId', parseInt(e))}
                value={taxManager?.currencyId?.toString() || undefined}>
                <SelectTrigger>
                  <SelectValue placeholder="Devise" />
                </SelectTrigger>
                <SelectContent>
                  {currencies?.map((currency) => (
                    <SelectItem key={currency.id} value={currency?.id?.toString() || ''}>
                      {currency?.code && tCurrency(currency?.code)} ({currency.symbol})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </SelectShimmer>
            <Label className="font-thin text-sm">
              {tSettings('tax.attributes.currency_description')}
            </Label>
          </div>
        )}
      </div>
    </div>
  );
};

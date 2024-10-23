import { Button } from '@/components/ui/button';
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
import { cn } from '@/lib/utils';
import { ArticleQuotationEntry, Currency, Tax } from '@/types';
import { Plus, X } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

interface TaxDisplayProps {
  tax?: Tax;
  currency?: Currency;
}
const TaxDisplay = ({ tax, currency }: TaxDisplayProps) => {
  const value = tax?.value ?? 0;
  const displayValue = tax?.isRate
    ? value.toFixed(2)
    : value.toFixed(currency?.digitAfterComma || 3);
  const symbol = tax?.isRate ? '%' : currency?.symbol || '$';
  return (
    <div className="my-2 flex flex-row justify-between gap-2 w-full">
      <Label className="font-extrabold text-xs"> {tax?.label}</Label>
      <Label className="text-xs">{`${displayValue} ${symbol}`}</Label>
    </div>
  );
};

interface QuotationTaxEntriesProps {
  className?: string;
  article: ArticleQuotationEntry;
  taxes: Tax[];
  selectedTaxIds: (number | undefined)[];
  currency?: Currency;
  handleTaxAdd: () => void;
  handleTaxChange: (value: string, index: number) => void;
  handleTaxDelete: (index: number) => void;
}

export const QuotationTaxEntries: React.FC<QuotationTaxEntriesProps> = ({
  className,
  article,
  taxes,
  selectedTaxIds,
  currency,
  handleTaxAdd,
  handleTaxChange,
  handleTaxDelete
}) => {
  const { t: tInvoicing } = useTranslation('invoicing');

  const rateTaxes = React.useMemo(() => {
    return taxes.filter((tax) => !selectedTaxIds.includes(tax.id) && tax.isRate);
  }, [taxes, selectedTaxIds]);

  const fixedAmountTaxes = React.useMemo(() => {
    return taxes.filter((tax) => !selectedTaxIds.includes(tax.id) && !tax.isRate);
  }, [taxes, selectedTaxIds]);

  return (
    <div className={cn('my-2', className)}>
      <Label className="font-thin">{tInvoicing('article.attributes.taxes')}</Label>
      {!article?.articleQuotationEntryTaxes?.length && (
        <Label className="font-bold block my-4 text-center">
          {tInvoicing('article.no_applied_tax')}
        </Label>
      )}
      {article.articleQuotationEntryTaxes?.map((appliedTax, i) => (
        <div className="flex items-center justify-between gap-2" key={i}>
          {appliedTax?.tax ? (
            <TaxDisplay tax={appliedTax?.tax} currency={currency} />
          ) : (
            <Select
              key={appliedTax?.tax?.id?.toString() || 'selected-tax'}
              onValueChange={(value) => handleTaxChange(value, i)}
              value={appliedTax?.tax?.id?.toString() || undefined}>
              <SelectTrigger className="my-1">
                <SelectValue placeholder="0%" />
              </SelectTrigger>
              <SelectContent align="center">
                {rateTaxes.length != 0 && (
                  <SelectGroup>
                    <SelectLabel>Pourcentages</SelectLabel>
                    {rateTaxes.map((tax) => (
                      <SelectItem key={tax.id} value={tax?.id?.toString() || ''} className="ml-2">
                        <div className="flex flex-row w-full justify-between gap-2">
                          <Label className="font-light"> {tax.label}</Label>
                          <Label>({(tax.value ?? 0).toFixed(2)}%)</Label>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
                {fixedAmountTaxes.length != 0 && (
                  <SelectGroup>
                    <SelectLabel>Fixed Price</SelectLabel>
                    {fixedAmountTaxes.map((tax) => (
                      <SelectItem key={tax.id} value={tax?.id?.toString() || ''} className="ml-2">
                        <div className="flex flex-row w-full justify-between gap-2">
                          <Label className="font-light"> {tax.label}</Label>
                          <Label>
                            ({(tax.value ?? 0).toFixed(currency?.digitAfterComma || 3)}
                            {currency?.symbol})
                          </Label>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectGroup>
                )}
              </SelectContent>
            </Select>
          )}
          <X
            className="h-4 w-4 cursor-pointer hover:text-red-600"
            onClick={() => handleTaxDelete(i)}
          />
        </div>
      ))}
      <div className="flex">
        <Button variant={'link'} className="mt-2 w-full" onClick={handleTaxAdd}>
          <Plus />
        </Button>
      </div>
    </div>
  );
};

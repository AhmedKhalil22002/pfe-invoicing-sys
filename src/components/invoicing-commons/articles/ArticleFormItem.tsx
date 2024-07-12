import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArticleQuotationEntry, Tax } from '@/api';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { DiscountType } from '@/api/enums/discount-types';

interface ArticleFormItemProps {
  className?: string;
  article: ArticleQuotationEntry;
  onChange: (item: ArticleQuotationEntry) => void;
  showDescription?: boolean;
  currencySymbol?: string;
  taxes: Tax[];
}

export const ArticleFormItem: React.FC<ArticleFormItemProps> = ({
  className,
  article,
  onChange,
  taxes,
  currencySymbol,
  showDescription = false
}) => {
  const addTax = () => {
    onChange({ ...article, taxes: [...(article.taxes || []), {} as Tax] });
  };

  const setTax = (tax: Tax | undefined, index: number) => {
    const updatedTaxes = [...(article.taxes || [])];
    if (tax) {
      updatedTaxes[index] = tax;
    } else {
      updatedTaxes.splice(index, 1);
    }
    onChange({ ...article, taxes: updatedTaxes });
  };

  const deleteTax = (index: number) => {
    const updatedTaxes = article.taxes.filter((_, i) => i !== index);
    onChange({ ...article, taxes: updatedTaxes });
  };

  return (
    <div className={cn(className, 'flex flex-row w-full gap-3 items-center')}>
      {/* Title & Description */}
      <div className="w-3/12">
        <Input
          className="mt-2"
          placeholder="Title"
          value={article?.article?.title}
          onChange={(e) =>
            onChange({ ...article, article: { ...article.article, title: e.target.value } })
          }
        />
        {showDescription && (
          <Input
            className="mt-2"
            placeholder="Description"
            value={article?.article?.description}
            onChange={(e) =>
              onChange({ ...article, article: { ...article.article, description: e.target.value } })
            }
          />
        )}
      </div>
      {/* Quantity */}
      <div className="w-2/12">
        <Input
          type="number"
          className="mt-2"
          placeholder="0"
          value={article?.quantity}
          onChange={(e) => onChange({ ...article, quantity: +e.target.value })}
        />
      </div>
      {/* Price & Discount */}
      <div className="w-3/12">
        <div className="flex items-center mt-2 gap-2">
          <Input
            type="number"
            placeholder="0"
            value={article?.unit_price}
            onChange={(e) => onChange({ ...article, unit_price: +e.target.value })}
          />
          <span className="mx-2">{currencySymbol}</span>
        </div>
        {/* Discount & Discount Type */}
        <div className="mt-2">
          <Label className="font-thin mx-1">Remise</Label>
          <div className="flex items-center mt-2 gap-2">
            <Input
              type="number"
              className="w-2/3"
              placeholder="0"
              min={0}
              max={100}
              value={article?.discount}
              onChange={(e) => onChange({ ...article, discount: +e.target.value })}
            />
            <Select
              onValueChange={(value: string) => {
                onChange({
                  ...article,
                  discount_type:
                    value === 'PERCENTAGE' ? DiscountType.PERCENTAGE : DiscountType.AMOUNT
                });
              }}
              defaultValue={
                article?.discount_type === DiscountType.PERCENTAGE ? 'PERCENTAGE' : 'AMOUNT'
              }>
              <SelectTrigger className="-mt-0.5 w-1/3">
                <SelectValue placeholder="%" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">%</SelectItem>
                <SelectItem value="AMOUNT">{currencySymbol} </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {/* Taxes */}
      <div className="w-2/12">
        {article.taxes &&
          article.taxes.map((appliedTax, i) => (
            <div className="flex items-center justify-between" key={i}>
              <Select
                onValueChange={(value) => {
                  const selectedTax = taxes.find((tax) => tax.id === +value);
                  setTax(selectedTax, i);
                }}
                defaultValue={appliedTax?.id?.toString() || ''}>
                <SelectTrigger className="mt-1 w-10/12">
                  <SelectValue placeholder="0%" />
                </SelectTrigger>
                <SelectContent>
                  {taxes.map((tax: Tax) => (
                    <SelectItem key={tax.id} value={tax?.id?.toString() || ''}>
                      {tax.label}% <span className="font-bold"> ({tax.rate}%)</span>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <X className="cursor-pointer" onClick={() => deleteTax(i)} />
            </div>
          ))}
        <Button className="mt-2 w-full" onClick={addTax}>
          Ajouter
        </Button>
      </div>
      {/* Total */}
      <div className="w-2/12 text-center">
        <Label>
          {article?.total?.toFixed(3)} {currencySymbol}
        </Label>
      </div>
    </div>
  );
};

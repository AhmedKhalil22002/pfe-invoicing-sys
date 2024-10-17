import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArticleQuotationEntry, Currency, Tax, TaxEntry } from '@/types';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { X } from 'lucide-react';
import { DISCOUNT_TYPE } from '@/types/enums/discount-types';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

interface ArticleFormItemProps {
  className?: string;
  article: ArticleQuotationEntry;
  onChange: (item: ArticleQuotationEntry) => void;
  showDescription?: boolean;
  currency?: Currency;
  taxes: Tax[];
}

export const QuotationArticleItem: React.FC<ArticleFormItemProps> = ({
  className,
  article,
  onChange,
  taxes,
  currency,
  showDescription = false
}) => {
  const { t: tCommon } = useTranslation('common');
  const { t: tInvoicing } = useTranslation('invoicing');

  const digitAfterComma = currency?.digitAfterComma || 3;
  const currencySymbol = currency?.symbol || '$';

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...article,
      article: {
        ...article.article,
        title: e.target.value
      }
    });
  };

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...article,
      article: {
        ...article.article,
        description: e.target.value
      }
    });
  };

  const handleQuantityChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...article,
      quantity: parseFloat(e.target.value)
    });
  };

  const handleUnitPriceChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...article,
      unit_price: parseFloat(e.target.value)
    });
  };

  const handleDiscountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...article,
      discount: parseFloat(e.target.value)
    });
  };

  const handleDiscountTypeChange = (value: string) => {
    onChange({
      ...article,
      discount_type: value === 'PERCENTAGE' ? DISCOUNT_TYPE.PERCENTAGE : DISCOUNT_TYPE.AMOUNT
    });
  };

  const handleTaxChange = (value: string, index: number) => {
    const selectedTax = taxes.find((tax) => tax.id === parseInt(value));
    const updatedTaxes = [...(article.articleQuotationEntryTaxes || [])];
    if (selectedTax) {
      updatedTaxes[index] = { tax: selectedTax };
    } else {
      updatedTaxes.splice(index, 1);
    }
    onChange({ ...article, articleQuotationEntryTaxes: updatedTaxes });
  };

  const handleTaxDelete = (index: number) => {
    const updatedTaxes = article.articleQuotationEntryTaxes?.filter((_, i) => i !== index);
    onChange({ ...article, articleQuotationEntryTaxes: updatedTaxes });
  };

  const addTax = () => {
    if ((article.articleQuotationEntryTaxes?.length || 0) >= taxes.length) {
      toast.warn(tInvoicing('quotation.errors.surpassed_tax_limit'));
      return;
    }
    onChange({
      ...article,
      articleQuotationEntryTaxes: [...(article.articleQuotationEntryTaxes || []), {} as TaxEntry]
    });
  };

  const selectedTaxIds = article.articleQuotationEntryTaxes?.map((t) => t.tax?.id) || [];

  return (
    <div className={cn(className, 'flex flex-row w-full gap-3 items-center')}>
      {/* Title & Description */}
      <div className="w-3/12">
        <Input
          className="mt-2"
          placeholder="Title"
          value={article.article?.title || ''}
          onChange={handleTitleChange}
        />
        {showDescription && (
          <Input
            className="mt-2"
            placeholder="Description"
            value={article.article?.description || ''}
            onChange={handleDescriptionChange}
          />
        )}
      </div>
      {/* Quantity */}
      <div className="w-2/12">
        <Input
          type="number"
          className="mt-2"
          placeholder="0"
          value={article.quantity || 0}
          onChange={handleQuantityChange}
        />
      </div>
      {/* Price & Discount */}
      <div className="w-3/12">
        <div className="flex items-center mt-2 gap-2">
          <Input
            type="number"
            placeholder="0"
            value={article.unit_price || 0}
            onChange={handleUnitPriceChange}
          />
          <span className="mx-2">{currency?.symbol}</span>
        </div>
        <div className="mt-2">
          <Label className="font-thin mx-1">{tInvoicing('quotation.attributes.discount')}</Label>
          <div className="flex items-center mt-2 gap-2">
            <Input
              type="number"
              className="w-2/3"
              placeholder="0"
              min={0}
              max={100}
              value={article.discount || 0}
              onChange={handleDiscountChange}
            />
            <Select
              onValueChange={handleDiscountTypeChange}
              defaultValue={
                article.discount_type === DISCOUNT_TYPE.PERCENTAGE ? 'PERCENTAGE' : 'AMOUNT'
              }>
              <SelectTrigger className="-mt-0.5 w-1/3">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PERCENTAGE">%</SelectItem>
                <SelectItem value="AMOUNT">{currency?.symbol || '$'}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </div>
      {/* Taxes */}
      <div className="w-2/12">
        {article.articleQuotationEntryTaxes?.map((appliedTax, i) => (
          <div className="flex items-center justify-between" key={i}>
            {appliedTax?.tax ? (
              <Label className="mx-2 my-3">
                {appliedTax.tax.label} ({appliedTax.tax.value}
                {appliedTax.tax.isRate ? '%' : currency?.symbol})
              </Label>
            ) : (
              <Select
                key={appliedTax?.tax?.id?.toString() || 'selected-tax'}
                onValueChange={(value) => handleTaxChange(value, i)}
                value={appliedTax?.tax?.id?.toString() || undefined}>
                <SelectTrigger className="mt-1 w-10/12">
                  <SelectValue placeholder="0%" />
                </SelectTrigger>
                <SelectContent>
                  {taxes
                    .filter((tax) => !selectedTaxIds.includes(tax.id))
                    .map((tax) => (
                      <SelectItem key={tax.id} value={tax?.id?.toString() || ''}>
                        {tax.label} ({tax.value}
                        {tax.isRate ? '%' : currency?.symbol})
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            )}
            <X className="h-4 w-4 cursor-pointer" onClick={() => handleTaxDelete(i)} />
          </div>
        ))}
        <Button className="mt-2 w-full" onClick={addTax}>
          {tCommon('commands.add')}
        </Button>
      </div>
      {/* Total */}
      <div className="w-2/12 text-center">
        <Label>
          {article?.subTotal?.toFixed(digitAfterComma)} {currencySymbol}
        </Label>
      </div>
    </div>
  );
};

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
import { Textarea } from '@/components/ui/textarea';

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

  const handleDescriptionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
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
    <div className={cn('flex flex-row items-center gap-6', className)}>
      <div className="w-8/12">
        <div className="flex flex-row gap-2 my-1">
          {/* Title */}
          <div className="w-3/5">
            <Label className="font-thin mx-1">{tInvoicing('article.attributes.title')}</Label>
            <Input
              placeholder="Title"
              value={article.article?.title || ''}
              onChange={handleTitleChange}
            />
          </div>
          {/* Quantity */}
          <div className="w-1/5">
            <Label className="font-thin mx-1">{tInvoicing('article.attributes.quantity')}</Label>
            <Input
              type="number"
              placeholder="0"
              value={article.quantity || 0}
              onChange={handleQuantityChange}
            />
          </div>
          {/* Price */}
          <div className="w-1/5">
            <Label className="font-thin mx-1">{tInvoicing('article.attributes.unit_price')}</Label>
            <div className="flex items-center gap-2">
              <Input
                type="number"
                placeholder="0"
                value={article.unit_price || 0}
                onChange={handleUnitPriceChange}
              />
              <Label className="font-thin mx-1">{currency?.symbol}</Label>
            </div>
          </div>
        </div>
        <div>
          {showDescription && (
            <div>
              <Label className="font-thin mx-1">
                {tInvoicing('article.attributes.description')}
              </Label>
              <Textarea
                placeholder="Description"
                className="resize-none"
                value={article.article?.description || ''}
                onChange={(e) => handleDescriptionChange(e)}
                rows={3 + (article?.articleQuotationEntryTaxes?.length || 0)}
              />
            </div>
          )}
        </div>
      </div>
      <div className="w-3/12">
        {/* Taxes */}

        <div className="my-2">
          <Label className="font-thin">{tInvoicing('article.attributes.taxes')}</Label>
          {!article?.articleQuotationEntryTaxes?.length && (
            <Label className="font-bold block my-4 text-center">
              {tInvoicing('article.no_applied_tax')}
            </Label>
          )}
          {article.articleQuotationEntryTaxes?.map((appliedTax, i) => (
            <div className="flex items-center justify-between gap-2" key={i}>
              {appliedTax?.tax ? (
                <div className="my-3.5 flex flex-row gap-2">
                  <Label className="font-extrabold"> {appliedTax.tax.label}</Label>
                  <Label>({appliedTax.tax.value}%)</Label>
                </div>
              ) : (
                <Select
                  key={appliedTax?.tax?.id?.toString() || 'selected-tax'}
                  onValueChange={(value) => handleTaxChange(value, i)}
                  value={appliedTax?.tax?.id?.toString() || undefined}>
                  <SelectTrigger className="my-1">
                    <SelectValue placeholder="0%" />
                  </SelectTrigger>
                  <SelectContent>
                    {taxes
                      .filter((tax) => !selectedTaxIds.includes(tax.id))
                      .map((tax) => (
                        <SelectItem
                          key={tax.id}
                          value={tax?.id?.toString() || ''}
                          className="pl-2 py-2">
                          <div className="flex flex-row w-full justify-between gap-2">
                            <Label className="font-extrabold"> {tax.label}</Label>
                            <Label>({tax.value}%)</Label>
                          </div>
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              )}
              <X className="h-4 w-4 cursor-pointer" onClick={() => handleTaxDelete(i)} />
            </div>
          ))}
          <div className="flex">
            <Button className="mt-2 w-full" onClick={addTax}>
              {tCommon('commands.add')}
            </Button>
          </div>
        </div>
        <div>
          <Label className="font-thin mx-1">{tInvoicing('quotation.attributes.discount')}</Label>
          <div className="flex items-center gap-2">
            <Input
              className="w-3/5"
              type="number"
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
              <SelectTrigger className="w-2/5">
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

      {/* Total */}
      <div className="w-1/12 text-center flex flex-col justify-between h-full gap-12 mx-4">
        <div className="flex flex-col gap-2">
          <Label className="font-thin mx-1">{tInvoicing('article.attributes.tax_excluded')}</Label>
          <Label>
            {article?.subTotal?.toFixed(digitAfterComma)} {currencySymbol}
          </Label>
        </div>
        <div className="flex flex-col gap-2">
          <Label className="font-thin mx-1">{tInvoicing('article.attributes.tax_included')}</Label>
          <Label>
            {article?.total?.toFixed(digitAfterComma)} {currencySymbol}
          </Label>
        </div>
      </div>
    </div>
  );
};

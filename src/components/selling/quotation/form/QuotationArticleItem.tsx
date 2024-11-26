import React from 'react';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { ArticleQuotationEntry, Currency, QuotationTaxEntry, Tax } from '@/types';
import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue
} from '@/components/ui/select';
import { DISCOUNT_TYPE } from '@/types/enums/discount-types';
import { toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';
import { Textarea } from '@/components/ui/textarea';
import { QuotationTaxEntries } from './QuotationTaxEntries';
import { UneditableInput } from '@/components/ui/uneditable/uneditable-input';

interface QuotationArticleItemProps {
  className?: string;
  article: ArticleQuotationEntry;
  onChange: (item: ArticleQuotationEntry) => void;
  showDescription?: boolean;
  currency?: Currency;
  taxes: Tax[];
  edit?: boolean;
}

export const QuotationArticleItem: React.FC<QuotationArticleItemProps> = ({
  className,
  article,
  onChange,
  taxes,
  currency,
  showDescription = false,
  edit = true
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

  const handleAddTax = () => {
    if ((article.articleQuotationEntryTaxes?.length || 0) >= taxes.length) {
      toast.warn(tInvoicing('quotation.errors.surpassed_tax_limit'));
      return;
    }
    onChange({
      ...article,
      articleQuotationEntryTaxes: [
        ...(article.articleQuotationEntryTaxes || []),
        {} as QuotationTaxEntry
      ]
    });
  };

  const selectedTaxIds = article.articleQuotationEntryTaxes?.map((t) => t.tax?.id) || [];

  return (
    <div className={cn('flex flex-row items-center gap-6', className)}>
      <div className="w-9/12">
        <div className="flex flex-row gap-2 my-1">
          {/* Title */}
          <div className="w-3/5">
            <Label className="font-thin mx-1">{tInvoicing('article.attributes.title')}</Label>
            {edit ? (
              <Input
                placeholder="Title"
                value={article.article?.title || ''}
                onChange={handleTitleChange}
              />
            ) : (
              <UneditableInput value={article.article?.title} />
            )}
          </div>
          {/* Quantity */}
          <div className="w-1/5">
            <Label className="font-thin mx-1">{tInvoicing('article.attributes.quantity')}</Label>
            {edit ? (
              <Input
                type="number"
                placeholder="0"
                value={article.quantity || 0}
                onChange={handleQuantityChange}
              />
            ) : (
              <UneditableInput value={article.quantity} />
            )}
          </div>
          {/* Price */}
          <div className="w-1/5">
            <Label className="font-thin mx-1">{tInvoicing('article.attributes.unit_price')}</Label>
            <div className="flex items-center gap-2">
              {edit ? (
                <Input
                  type="number"
                  placeholder="0"
                  value={article.unit_price || 0}
                  onChange={handleUnitPriceChange}
                />
              ) : (
                <UneditableInput value={article.unit_price} />
              )}
              <Label className="font-thin mx-1">{currency?.symbol}</Label>
            </div>
          </div>
        </div>
        <div>
          {showDescription && (
            <div>
              {edit ? (
                <>
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
                </>
              ) : (
                article.article?.description && (
                  <>
                    <Label className="font-thin mx-1">
                      {tInvoicing('article.attributes.description')}
                    </Label>
                    <Textarea
                      disabled
                      value={article.article?.description}
                      className="resize-none"
                      onClick={() => {}}
                      rows={3 + (article?.articleQuotationEntryTaxes?.length || 0)}
                    />
                  </>
                )
              )}
            </div>
          )}
        </div>
      </div>
      <div className="w-3/12">
        {/* Taxes */}
        {!edit && selectedTaxIds.length != 0 && (
          <QuotationTaxEntries
            article={article}
            taxes={taxes}
            selectedTaxIds={selectedTaxIds}
            currency={currency}
            handleTaxAdd={handleAddTax}
            handleTaxChange={handleTaxChange}
            handleTaxDelete={handleTaxDelete}
            edit={edit}
          />
        )}
        {/* Discount */}
        <div>
          <Label className="font-thin mx-1">{tInvoicing('quotation.attributes.discount')}</Label>
          <div className="flex items-center gap-2">
            {edit ? (
              <Input
                className="w-1/2"
                type="number"
                placeholder="0"
                min={0}
                max={100}
                value={article.discount || 0}
                onChange={handleDiscountChange}
              />
            ) : (
              <UneditableInput value={article.discount} />
            )}
            {edit ? (
              <Select
                onValueChange={handleDiscountTypeChange}
                defaultValue={
                  article.discount_type === DISCOUNT_TYPE.PERCENTAGE ? 'PERCENTAGE' : 'AMOUNT'
                }>
                <SelectTrigger className="w-1/2">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PERCENTAGE">%</SelectItem>
                  <SelectItem value="AMOUNT">{currency?.symbol || '$'}</SelectItem>
                </SelectContent>
              </Select>
            ) : (
              <UneditableInput
                className="w-1/2 border-0 font-thin mx-1"
                value={
                  article.discount_type === DISCOUNT_TYPE.PERCENTAGE ? '%' : currency?.symbol || '$'
                }
              />
            )}
          </div>
        </div>
      </div>

      {/* Total */}
      <div className="w-2/12 text-center flex flex-col justify-between h-full gap-12 mx-4">
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

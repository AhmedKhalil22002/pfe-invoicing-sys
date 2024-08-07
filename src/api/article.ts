import { DiscountType } from './enums/discount-types';
import { ArticleQuotationEntry } from './types';

const factory = (): ArticleQuotationEntry => {
  return {
    article: { title: '', description: '' },
    unit_price: 0,
    quantity: 0,
    discount: 0,
    discount_type: DiscountType.PERCENTAGE,
    articleQuotationEntryTaxes: [],
    total: 0
  };
};

export const article = { factory };

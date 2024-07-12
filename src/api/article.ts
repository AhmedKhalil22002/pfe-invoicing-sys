import { DiscountType } from './enums/discount-types';
import { ArticleEntry } from './types';

const factory = (): ArticleEntry => {
  return {
    article: { title: '', description: '' },
    unit_price: 0,
    quantity: 0,
    discount: 0,
    discount_type: DiscountType.PERCENTAGE,
    taxes: [],
    total: 0
  };
};

export const article = { factory };

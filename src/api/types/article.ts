import { Tax } from './tax';

export type Article = {
  id?: number;
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export enum DiscountType {
  PERCENTAGE = 'percentage',
  AMOUNT = 'amount'
}

export type ArticleEntry = {
  id?: number;
  article?: Article;
  articleId?: number;
  unit_price?: number;
  quantity?: number;
  discount?: number;
  discount_type?: DiscountType;
  taxes: Tax[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export type ArticleQuotationEntry = ArticleEntry & {
  quotationId?: number;
};

export type ArticleInvoiceEntry = ArticleEntry & {
  invoiceId?: number;
};

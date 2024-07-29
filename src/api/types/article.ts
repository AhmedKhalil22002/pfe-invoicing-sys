import { DiscountType } from '../enums/discount-types';
import { Tax } from './tax';

export interface Article {
  id?: number;
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleteRestricted?: boolean;
}

export interface ArticleEntry {
  id?: number;
  article?: Article;
  articleId?: number;
  unit_price?: number;
  quantity?: number;
  discount?: number;
  discount_type?: DiscountType;
  total?: number;
  taxes?: Tax[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleteRestricted?: boolean;
}

export interface ArticleQuotationEntry extends ArticleEntry {
  quotationId?: number;
}

export interface ArticleInvoiceEntry extends ArticleEntry {
  invoiceId?: number;
}

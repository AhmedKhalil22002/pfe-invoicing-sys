import { DISCOUNT_TYPE } from '../enums/discount-types';
import { TaxEntry } from './tax';

export interface Article {
  id?: number;
  title?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleteRestricted?: boolean;
}

export interface ArticleInvoiceEntry {
  id?: number;
  article?: Article;
  articleId?: number;
  unit_price?: number;
  quantity?: number;
  discount?: number;
  discount_type?: DISCOUNT_TYPE;
  total?: number;
  taxes?: TaxEntry[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleteRestricted?: boolean;
  articleInvoiceEntryTaxes: TaxEntry;
  invoiceId?: number;
}

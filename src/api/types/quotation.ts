import { DiscountType } from '../enums/discount-types';
import { PagedResponse } from '../response';
import { Article } from './article';
import { Currency } from './currency';
import { Firm } from './firm';
import { Interlocutor } from './interlocutor';
import { TaxEntry } from './tax';

export enum QUOTATION_STATUS {
  Nonexistent = 'quotation.status.non_existent',
  Expired = 'quotation.status.expired',
  Draft = 'quotation.status.draft',
  Validated = 'quotation.status.validated',
  Sent = 'quotation.status.sent',
  Accepted = 'quotation.status.accepted',
  Rejected = 'quotation.status.rejected'
}

export interface ArticleQuotationEntry {
  id?: number;
  quotationId?: number;
  article?: Article;
  articleId?: number;
  unit_price?: number;
  quantity?: number;
  discount?: number;
  discount_type?: DiscountType;
  articleQuotationEntryTaxes?: TaxEntry[];
  subTotal?: number;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleteRestricted?: boolean;
}

export interface CreateArticleQuotationEntry
  extends Omit<
    ArticleQuotationEntry,
    | 'id'
    | 'quotationId'
    | 'subTotal'
    | 'total'
    | 'updatedAt'
    | 'createdAt'
    | 'deletedAt'
    | 'isDeleteRestricted'
    | 'articleQuotationEntryTaxes'
  > {
  taxes?: number[];
}

export interface Quotation {
  id?: number;
  object?: string;
  date?: string;
  dueDate?: string;
  status?: QUOTATION_STATUS;
  generalConditions?: string;
  total?: number;
  subTotal?: number;
  discount?: number;
  discount_type?: DiscountType;
  currencyId?: number;
  currency?: Currency;
  firmId?: number;
  firm?: Firm;
  interlocutorId?: number;
  interlocutor?: Interlocutor;
  notes?: string;
  articleQuotationEntries?: ArticleQuotationEntry[];
  taxStamp?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleteRestricted?: boolean;
}

export interface CreateQuotationDto
  extends Omit<
    Quotation,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'isDeleteRestricted'
    | 'articles'
    | 'firm'
    | 'interlocutor'
  > {
  articleQuotationEntries: CreateArticleQuotationEntry[];
}

export interface UpdateQuotationDto extends CreateQuotationDto {
  id?: number;
}
export interface PagedQuotation extends PagedResponse<Quotation> {}

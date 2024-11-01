import { Article } from './article';
import { Cabinet } from './cabinet';
import { Currency } from './currency';
import { DISCOUNT_TYPE } from './enums/discount-types';
import { Firm } from './firm';
import { Interlocutor } from './interlocutor';
import { Invoice } from './invoice';
import { PagedResponse } from './response';
import { Tax } from './tax';
import { Upload } from './upload';

export enum QUOTATION_STATUS {
  Nonexistent = 'quotation.status.non_existent',
  Expired = 'quotation.status.expired',
  Draft = 'quotation.status.draft',
  Validated = 'quotation.status.validated',
  Sent = 'quotation.status.sent',
  Accepted = 'quotation.status.accepted',
  Rejected = 'quotation.status.rejected',
  Invoiced = 'quotation.status.invoiced'
}

export interface QuotationTaxEntry {
  id?: number;
  articleQuotationEntryId?: number;
  tax?: Tax;
  taxId?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface ArticleQuotationEntry {
  id?: number;
  quotationId?: number;
  article?: Article;
  articleId?: number;
  unit_price?: number;
  quantity?: number;
  discount?: number;
  discount_type?: DISCOUNT_TYPE;
  articleQuotationEntryTaxes?: QuotationTaxEntry[];
  subTotal?: number;
  total?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
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
    | 'isDeletionRestricted'
    | 'articleQuotationEntryTaxes'
  > {
  taxes?: number[];
}

export interface QuotationMetaData {
  id?: number;
  showInvoiceAddress?: boolean;
  showDeliveryAddress?: boolean;
  showArticleDescription?: boolean;
  hasBankingDetails?: boolean;
  hasGeneralConditions?: boolean;
  taxSummary?: { taxId: number; amount: number }[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface QuotationUpload {
  id?: number;
  quotationId?: number;
  quotation?: Quotation;
  uploadId?: number;
  upload?: Upload;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface Quotation {
  id?: number;
  sequential?: string;
  object?: string;
  date?: string;
  dueDate?: string;
  status?: QUOTATION_STATUS;
  generalConditions?: string;
  defaultCondition?: boolean;
  total?: number;
  subTotal?: number;
  discount?: number;
  discount_type?: DISCOUNT_TYPE;
  currencyId?: number;
  currency?: Currency;
  bankAccountId?: number;
  bankAccount?: Currency;
  firmId?: number;
  firm?: Firm;
  cabinet?: Cabinet;
  cabinetId?: number;
  interlocutorId?: number;
  interlocutor?: Interlocutor;
  notes?: string;
  articleQuotationEntries?: ArticleQuotationEntry[];
  quotationMetaData?: QuotationMetaData;
  uploads?: QuotationUpload[];
  invoices: Invoice[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface CreateQuotationDto
  extends Omit<
    Quotation,
    | 'id'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'isDeletionRestricted'
    | 'articles'
    | 'firm'
    | 'interlocutor'
    | 'sequential'
    | 'bankAccount'
    | 'invoices'
  > {
  articleQuotationEntries?: CreateArticleQuotationEntry[];
  files?: File[];
}

export interface UpdateQuotationDto extends CreateQuotationDto {
  id?: number;
}

export interface DuplicateQuotationDto {
  id?: number;
  includeFiles?: boolean;
}

export interface PagedQuotation extends PagedResponse<Quotation> {}

export interface QuotationUploadedFile {
  upload: QuotationUpload;
  file: File;
}

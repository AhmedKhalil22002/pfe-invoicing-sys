import { Article } from './article';
import { ResponseBankAccountDto } from './bank-account';
import { Cabinet } from './cabinet';
import { Currency } from './currency';
import { DISCOUNT_TYPE } from './enums/discount-types';
import { Firm } from './firm';
import { Interlocutor } from './interlocutor';
import { PagedResponse } from './response';
import { DatabaseEntity } from './response/DatabaseEntity';
import { Tax } from './tax';
import { Upload } from './upload';

export enum PURCHASE_QUOTATION_STATUS {
  Nonexistent = 'purchase-quotation.status.non_existent',
  Expired = 'purchase-quotation.status.expired',
  Draft = 'purchase-quotation.status.draft',
  Validated = 'purchase-quotation.status.validated',
  Sent = 'purchase-quotation.status.sent',
  Accepted = 'purchase-quotation.status.accepted',
  Rejected = 'purchase-quotation.status.rejected',
  Invoiced = 'purchase-quotation.status.invoiced'
}

export interface PurchaseQuotationTaxEntry extends DatabaseEntity {
  id?: number;
  articlePurchaseQuotationEntryId?: number;
  tax?: Tax;
  taxId?: number;
}

export interface ArticlePurchaseQuotationEntry extends DatabaseEntity {
  id?: number;
  purchaseQuotationId?: number;
  article?: Article;
  articleId?: number;
  unit_price?: number;
  quantity?: number;
  discount?: number;
  discount_type?: DISCOUNT_TYPE;
  articlePurchaseQuotationEntryTaxes?: PurchaseQuotationTaxEntry[];
  subTotal?: number;
  total?: number;
}

export interface CreateArticlePurchaseQuotationEntry
  extends Omit<
    ArticlePurchaseQuotationEntry,
    | 'id'
    | 'purchaseQuotationId'
    | 'subTotal'
    | 'total'
    | 'updatedAt'
    | 'createdAt'
    | 'deletedAt'
    | 'isDeletionRestricted'
    | 'articlePurchaseQuotationEntryTaxes'
  > {
  taxes?: number[];
}

export interface PurchaseQuotationMetaData extends DatabaseEntity {
  id?: number;
  showInvoiceAddress?: boolean;
  showDeliveryAddress?: boolean;
  showArticleDescription?: boolean;
  hasBankingDetails?: boolean;
  hasGeneralConditions?: boolean;
  taxSummary?: { taxId: number; amount: number }[];
}

export interface PurchaseQuotationUpload extends DatabaseEntity {
  id?: number;
  purchaseQuotationId?: number;
  purchaseQuotation?: PurchaseQuotation;
  uploadId?: number;
  upload?: Upload;
}

export interface PurchaseQuotation extends DatabaseEntity {
  id?: number;
  sequential?: string;
  object?: string;
  date?: string;
  dueDate?: string;
  status?: PURCHASE_QUOTATION_STATUS;
  generalConditions?: string;
  defaultCondition?: boolean;
  total?: number;
  subTotal?: number;
  discount?: number;
  discount_type?: DISCOUNT_TYPE;
  currencyId?: number | null;
  currency?: Currency;
  bankAccountId?: number | null;
  bankAccount?:  ResponseBankAccountDto ;
  firmId?: number;
  firm?: Firm;
  cabinet?: Cabinet;
  cabinetId?: number;
  interlocutorId?: number;
  interlocutor?: Interlocutor;
  notes?: string;
  articlePurchaseQuotationEntries?: ArticlePurchaseQuotationEntry[];
  purchaseQuotationMetaData?: PurchaseQuotationMetaData;
  uploads?: PurchaseQuotationUpload[];
}

export interface CreatePurchaseQuotationDto
  extends Omit<
    PurchaseQuotation,
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
  articlePurchaseQuotationEntries?: CreateArticlePurchaseQuotationEntry[];
  files?: File[];
}

export interface UpdatePurchaseQuotationDto extends CreatePurchaseQuotationDto {
  id?: number;
  createInvoice?: boolean;
}

export interface DuplicatePurchaseQuotationDto {
  id?: number;
  includeFiles?: boolean;
}

export interface PagedPurchaseQuotation extends PagedResponse<PurchaseQuotation> {}

export interface PurchaseQuotationUploadedFile {
  upload: PurchaseQuotationUpload;
  file: File;
}

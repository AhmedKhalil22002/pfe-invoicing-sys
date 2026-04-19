import { Article } from './article';
import { Cabinet } from './cabinet';
import { Currency } from './currency';
import { DateFormat } from './enums';
import { DISCOUNT_TYPE } from './enums/discount-types';
import { Firm } from './firm';
import { Interlocutor } from './interlocutor';
import { PaymentPurchaseInvoiceEntry } from './purchase-invoice-payment';
import { PurchaseQuotation } from './purchase-quotation';
import { PagedResponse } from './response';
import { DatabaseEntity } from './response/DatabaseEntity';
import { Tax } from './tax';
import { TaxWithholding } from './tax-withholding';
import { Upload } from './upload';

export enum PURCHASE_INVOICE_STATUS {
  Nonexistent = 'purchaseInvoice.status.non_existent',
  Draft = 'purchaseInvoice.status.draft',
  Validated = 'purchaseInvoice.status.validated',
  Sent = 'purchaseInvoice.status.sent',
  Paid = 'purchaseInvoice.status.paid',
  PartiallyPaid = 'purchaseInvoice.status.partially_paid',
  Unpaid = 'purchaseInvoice.status.unpaid',
  Expired = 'purchaseInvoice.status.expired'
}

export interface PurchaseInvoiceTaxEntry extends DatabaseEntity {
  id?: number;
  articlePurchaseInvoiceEntryId?: number;
  tax?: Tax;
  taxId?: number;
}

export interface ArticlePurchaseInvoiceEntry extends DatabaseEntity {
  id?: number;
  purchaseInvoiceId?: number;
  article?: Article;
  articleId?: number;
  unit_price?: number;
  quantity?: number;
  discount?: number;
  discount_type?: DISCOUNT_TYPE;
  articlePurchaseInvoiceEntryTaxes?: PurchaseInvoiceTaxEntry[];
  subTotal?: number;
  total?: number;
}

export interface CreateArticlePurchaseInvoiceEntry
  extends Omit<
    ArticlePurchaseInvoiceEntry,
    | 'id'
    | 'purchaseInvoiceId'
    | 'subTotal'
    | 'total'
    | 'updatedAt'
    | 'createdAt'
    | 'deletedAt'
    | 'isDeletionRestricted'
    | 'articlePurchaseInvoiceEntryTaxes'
  > {
  taxes?: number[];
}

export interface PurchaseInvoiceMetaData extends DatabaseEntity {
  id?: number;
  showPurchaseInvoiceAddress?: boolean;
  showDeliveryAddress?: boolean;
  showArticleDescription?: boolean;
  hasBankingDetails?: boolean;
  hasGeneralConditions?: boolean;
  hasTaxStamp?: boolean;
  taxSummary?: { taxId: number; amount: number }[];
  hasTaxWithholding?: boolean;
}

export interface PurchaseInvoiceUpload extends DatabaseEntity {
  id?: number;
  purchaseInvoiceId?: number;
  purchaseInvoice?: PurchaseInvoice;
  uploadId?: number;
  upload?: Upload;
}

export interface PurchaseInvoice extends DatabaseEntity {
  id?: number;
  sequential?: string;
  object?: string;
  date?: string;
  dueDate?: string;
  status?: PURCHASE_INVOICE_STATUS;
  generalConditions?: string;
  defaultCondition?: boolean;
  total?: number;
  amountPaid?: number;
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
  purchaseQuotationId?: number;
  purchaseQuotation?: PurchaseQuotation;
  articlePurchaseInvoiceEntries?: ArticlePurchaseInvoiceEntry[];
  purchaseInvoiceMetaData?: PurchaseInvoiceMetaData;
  uploads?: PurchaseInvoiceUpload[];
  // payments?: PaymentPurchaseInvoiceEntry[];
  taxStamp?: Tax;
  taxStampId?: number;
  taxWithholding?: TaxWithholding;
  taxWithholdingId?: number;
  taxWithholdingAmount?: number;
}

export interface CreatePurchaseInvoiceDto
  extends Omit<
    PurchaseInvoice,
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
  > {
  articlePurchaseInvoiceEntries?: CreateArticlePurchaseInvoiceEntry[];
  files?: File[];
}

export interface UpdatePurchaseInvoiceDto extends CreatePurchaseInvoiceDto {
  id?: number;
}

export interface DuplicatePurchaseInvoiceDto {
  id?: number;
  includeFiles?: boolean;
}

export interface UpdatePurchaseInvoiceSequentialNumber {
  prefix?: string;
  dateFormat?: DateFormat;
  next?: number;
}

export interface PagedPurchaseInvoice extends PagedResponse<PurchaseInvoice> {}

export interface PurchaseInvoiceUploadedFile {
  upload: PurchaseInvoiceUpload;
  file: File;
}

export interface ResponsePurchaseInvoiceRangeDto {
  next?: PurchaseInvoice;
  previous?: PurchaseInvoice;
}

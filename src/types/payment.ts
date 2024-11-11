import { Currency } from './currency';
import { Invoice } from './invoice';
import { PagedResponse } from './response';
import { Upload } from './upload';

export enum PAYMENT_MODE {
  Cash = 'payment.payment_mode.cash',
  CreditCard = 'payment.payment_mode.credit_card',
  Check = 'payment.payment_mode.check',
  BankTransfer = 'payment.payment_mode.bank_transfer',
  WireTransfer = 'payment.payment_mode.wire_transfer'
}

export interface PaymentUpload {
  id?: number;
  paymentId?: number;
  payment?: Payment;
  uploadId?: number;
  upload?: Upload;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface PaymentInvoiceEntry {
  id?: number;
  invoiceId?: number;
  invoice?: Invoice;
  paymentId?: number;
  payment?: Payment;
  amount?: number;
  convertionRate?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface Payment {
  id?: number;
  amount?: number;
  fee?: number;
  date?: string;
  mode?: PAYMENT_MODE;
  notes?: string;
  uploads?: PaymentUpload[];
  invoices?: PaymentInvoiceEntry[];
  currency?: Currency;
  currencyId?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface CreatePaymentDto
  extends Omit<Payment, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeletionRestricted'> {
  files?: File[];
}

export interface UpdatePaymentDto extends CreatePaymentDto {
  id?: number;
}

export interface PagedPayment extends PagedResponse<Payment> {}

export interface PaymentUploadedFile {
  upload?: PaymentUpload;
  file?: File;
}

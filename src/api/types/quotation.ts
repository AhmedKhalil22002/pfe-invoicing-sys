import { DiscountType } from '../enums/discount-types';
import { ArticleQuotationEntry } from './article';
import { Currency } from './currency';
import { Firm } from './firm';
import { Interlocutor } from './interlocutor';

export enum QUOTATION_STATUS {
  Nonexistent = 'quotation.status.non_existent',
  Expired = 'quotation.status.expired',
  Draft = 'quotation.status.draft',
  Validated = 'quotation.status.validated',
  Sent = 'quotation.status.sent',
  Accepted = 'quotation.status.accepted',
  Rejected = 'quotation.status.rejected'
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
  articles?: ArticleQuotationEntry[];
  taxStamp?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleteRestricted?: boolean;
}

export const QUOTATION_COLUMNS_WIDTH = {
  '[id]': '5%',
  '[date]': '15%',
  '[dueDate]': '15%',
  '[firm][name]': '10%',
  '[interlocutor][name]': '5%',
  '[status]': '5%',
  '[total]': '10%'
};

export const QUOTATION_COLUMNS = [
  {
    code: 'quotation.attributes.number',
    key: '[id]',
    default: true,
    canBeSearched: true
  },
  {
    code: 'quotation.attributes.date',
    key: '[date]',
    default: true,
    canBeSearched: true
  },
  {
    code: 'quotation.attributes.due_date',
    key: '[dueDate]',
    default: true,
    canBeSearched: true
  },
  {
    code: 'quotation.attributes.firm',
    key: '[firm][name]',
    default: true,
    canBeSearched: true
  },
  {
    code: 'quotation.attributes.interlocutor',
    key: '[interlocutor][name]',
    default: true,
    canBeSearched: true
  },
  {
    code: 'quotation.attributes.status',
    key: '[status]',
    default: true,
    canBeSearched: true
  },
  {
    code: 'quotation.attributes.total',
    key: '[total]',
    default: true,
    canBeSearched: true
  },
  {
    code: 'quotation.attributes.created_at',
    key: '[createdAt]',
    default: true,
    canBeSearched: true
  }
];

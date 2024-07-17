import { DiscountType } from '../enums/discount-types';
import { ArticleQuotationEntry } from './article';
import { Currency } from './currency';
import { Firm } from './firm';
import { Interlocutor } from './interlocutor';

export enum QUOTATION_STATUS {
  Draft = 'Broullion',
  Validated = 'Validé',
  Canceled = 'Annulé',
  Sent = 'Envoyé',
  Accepted = 'Accepté',
  Rejected = 'Rejeté'
}

export type Quotation = {
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
};

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
    name: 'N°',
    key: '[id]',
    default: true,
    canBeSearched: true
  },
  {
    name: 'Date',
    key: '[date]',
    default: true,
    canBeSearched: true
  },
  {
    name: 'Échéance',
    key: '[dueDate]',
    default: true,
    canBeSearched: true
  },
  {
    name: 'Entreprise',
    key: '[firm][name]',
    default: true,
    canBeSearched: true
  },
  {
    name: 'Interlocuteur',
    key: '[interlocutor][surname]',
    default: true,
    canBeSearched: false
  },
  {
    name: 'Statut',
    key: '[status]',
    default: true,
    canBeSearched: true
  },
  {
    name: 'Totale',
    key: '[total]',
    default: true,
    canBeSearched: true
  },
  {
    name: 'Date de Création',
    key: '[createdAt]',
    default: true,
    canBeSearched: true
  }
];

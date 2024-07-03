import { Currency } from './currency';
import { Firm } from './firm';
import { Interlocutor } from './interlocutor';

export type Quotation = {
  id?: number;
  object?: string;
  date?: string;
  dueDate?: string;
  status?: string;
  generalConditions?: string;
  total?: number;
  subTotal?: number;
  discount?: number;
  currencyId?: number;
  currency?: Currency;
  firmId?: number;
  firm?: Firm;
  interlocutorId?: number;
  interlocutor?: Interlocutor;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

export const QUOTATION_COLUMNS_WIDTH = {
  '[id]': '5%',
  '[object]': '25%',
  '[date]': '10%',
  '[dueDate]': '10%',
  '[firm][name]': '15%',
  '[interlocutor][name]': '15%',
  '[status]': '10%',
  '[total]': '10%'
};

export const quotationColumns = [
  {
    name: 'N°',
    key: '[id]',
    default: true
  },
  {
    name: 'Objet',
    key: '[object]',
    default: true
  },
  {
    name: 'Date',
    key: '[date]',
    default: true
  },
  {
    name: 'Échéance',
    key: '[dueDate]',
    default: false
  },
  {
    name: 'Firme',
    key: '[firm][name]',
    default: false
  },
  {
    name: 'Interlocuteur',
    key: '[interlocutor][name]',
    default: false
  },
  {
    name: 'Statut',
    key: '[status]',
    default: false
  },
  {
    name: 'Totale',
    key: '[total]',
    default: true
  }
];

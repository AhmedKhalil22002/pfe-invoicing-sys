import { Currency } from './currency';

export interface BankAccount {
  id: number;
  name: string;
  bic: string;
  rib: string;
  iban: string;
  currency: Currency;
  currencyId: number;
  isMain: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export const BANK_ACCOUNT_COLUMNS = [
  {
    name: 'Nom de la banque',
    key: '[name]',
    default: true
  },
  {
    name: 'BIC',
    key: '[bic]',
    default: true
  },
  {
    name: 'RIB',
    key: '[rib]',
    default: true
  },
  {
    name: 'IBAN',
    key: '[iban]',
    default: true
  },
  {
    name: 'Devise',
    key: '[currency][label]',
    default: true
  },
  {
    name: 'ajouté le',
    key: '[createdAt]',
    default: true
  }
];

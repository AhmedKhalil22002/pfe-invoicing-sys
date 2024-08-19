import { Currency } from './currency';

export interface BankAccount {
  id?: number;
  name?: string;
  bic?: string;
  rib?: string;
  iban?: string;
  currency?: Currency;
  currencyId?: number;
  isMain?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleteRestricted?: boolean;
}
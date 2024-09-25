import { Currency } from './currency';
import { PagedResponse } from './response';

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
  isDeletionRestricted?: boolean;
}

export interface CreateBankAccountDto
  extends Omit<BankAccount, 'id' | 'currency' | 'isDeletionRestricted'> {}
export interface UpdateBankAccountDto
  extends Omit<BankAccount, 'currency' | 'isDeletionRestricted'> {}
export interface PagedBankAccount extends PagedResponse<BankAccount> {}

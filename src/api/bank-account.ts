import { PagedResponse } from './response';
import { BankAccount } from './types/bank-account';
import axios from './axios';
import { ToastValidation } from './types';

export interface CreateBankAccountDto
  extends Omit<BankAccount, 'id' | 'currency' | 'isDeleteRestricted'> {}
export interface UpdateBankAccountDto
  extends Omit<BankAccount, 'currency' | 'isDeleteRestricted'> {}
export interface PagedBankAccount extends PagedResponse<BankAccount> {}

const factory = (): BankAccount => {
  return {
    id: undefined,
    name: '',
    bic: '',
    currency: undefined,
    iban: '',
    rib: '',
    isMain: false
  };
};

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  searchKey: string = 'name',
  search: string = ''
): Promise<PagedBankAccount> => {
  const response = await axios.get<PagedBankAccount>(
    `public/bank-account/list?sort=${sortKey},${order}&filter=${searchKey}||$cont||${search}&join=currency&limit=${size}&page=${page}`
  );
  return response.data;
};

const find = async (): Promise<BankAccount[]> => {
  const response = await axios.get('public/bank-account/all');
  return response.data;
};

const create = async (bankAccount: CreateBankAccountDto): Promise<BankAccount> => {
  const response = await axios.post<BankAccount>('public/bank-account', bankAccount);
  return response.data;
};

const update = async (bankAccount: UpdateBankAccountDto): Promise<BankAccount> => {
  const response = await axios.put<BankAccount>(
    `public/bank-account/${bankAccount.id}`,
    bankAccount
  );
  return response.data;
};

const remove = async (id: number) => {
  const { data, status } = await axios.delete<BankAccount>(`public/bank-account/${id}`);
  return { data, status };
};

const validate = (bankAccount: Partial<BankAccount>): ToastValidation => {
  if (!bankAccount?.name) return { message: 'Nom de la banque est obligatoire' };
  if (bankAccount?.name.length < 3)
    return { message: 'Nom de la banque doit comporter au moins 3 caractères' };
  if (!bankAccount?.currency?.id) return { message: 'Devise est obligatoire' };
  if (bankAccount?.bic === '') return { message: 'BIC/SWIFT est obligatoire' };
  if (bankAccount?.iban === '') return { message: 'IBAN est obligatoire' };
  if (bankAccount?.rib === '') return { message: 'RIB est obligatoire' };
  return { message: '' };
};

export const bankAccount = { find, findPaginated, factory, create, update, remove, validate };

import { PagedResponse } from './response';
import { BankAccount } from './types/bank-account';
import axios from './axios';
import { ToastValidation } from './types';

export interface CreateBankAccountDto
  extends Omit<BankAccount, 'id' | 'currency' | 'isDeletionRestricted'> {}
export interface UpdateBankAccountDto
  extends Omit<BankAccount, 'currency' | 'isDeletionRestricted'> {}
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

export const BANK_ACCOUNT_FILTER_ATTRIBUTES = {
  name: 'name',
  bic: 'bic',
  rib: 'rib',
  iban: 'iban',
  currency: 'currency.label',
  isMain: 'isMain'
};

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = '',
  search: string = ''
): Promise<PagedBankAccount> => {
  const filters = search
    ? Object.values(BANK_ACCOUNT_FILTER_ATTRIBUTES)
        .map((key) => `${key}||$cont||${search}`)
        .join('||$or||')
    : '';

  let requestUrl = `public/bank-account/list?join=currency&limit=${size}&page=${page}`;

  if (sortKey) {
    requestUrl += `&sort=${sortKey},${order}`;
  }

  if (filters) {
    requestUrl += `&filter=${filters}`;
  }

  const response = await axios.get<PagedBankAccount>(requestUrl);
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

const validate = (
  bankAccount: Partial<BankAccount>,
  mainByDefault: boolean = false
): ToastValidation => {
  if (!bankAccount?.name) return { message: 'Nom de la banque est obligatoire' };
  if (bankAccount?.name.length < 3)
    return { message: 'Nom de la banque doit comporter au moins 3 caractères' };
  if (!bankAccount?.currency?.id) return { message: 'Devise est obligatoire' };
  if (bankAccount?.bic === '') return { message: 'BIC/SWIFT est obligatoire' };
  if (bankAccount?.iban === '') return { message: 'IBAN est obligatoire' };
  if (bankAccount?.rib === '') return { message: 'RIB est obligatoire' };
  if (mainByDefault && !bankAccount.isMain) return { message: 'La banque doit être principale' };
  return { message: '' };
};

export const bankAccount = {
  find,
  findPaginated,
  factory,
  create,
  update,
  remove,
  validate
};

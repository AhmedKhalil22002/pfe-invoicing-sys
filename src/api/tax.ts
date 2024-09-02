import { isAlphabeticOrSpace, isValue } from '@/utils/validations/string.validations';
import axios from './axios';
import { PagedResponse } from './response';
import { Tax } from './types/tax';
import { ToastValidation } from './types';

export interface CreateTaxDto
  extends Pick<Tax, 'label' | 'rate' | 'isSpecial' | 'isDeleteRestricted'> {}
export interface UpdateTaxDto
  extends Pick<Tax, 'label' | 'rate' | 'isSpecial' | 'id' | 'isDeleteRestricted'> {}
export interface PagedTax extends PagedResponse<Tax> {}

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  searchKey: string = 'label',
  search: string = ''
): Promise<PagedTax> => {
  const response = await axios.get<PagedTax>(
    `public/tax/list?sort=${sortKey},${order}&filter=${searchKey}||$cont||${search}&limit=${size}&page=${page}`
  );
  return response.data;
};

const find = async (): Promise<Tax[]> => {
  const response = await axios.get<Tax[]>(`public/tax/all`);
  return response.data;
};

const create = async (tax: CreateTaxDto): Promise<Tax> => {
  const response = await axios.post<Tax>('public/tax', tax);
  return response.data;
};

const update = async (activity: UpdateTaxDto): Promise<Tax> => {
  const response = await axios.put<Tax>(`public/tax/${activity.id}`, activity);
  return response.data;
};

const remove = async (id: number) => {
  const { data, status } = await axios.delete<Tax>(`public/tax/${id}`);
  return { data, status };
};

const validate = (tax: CreateTaxDto | UpdateTaxDto): ToastValidation => {
  if (!tax?.label || tax?.label.length < 3) {
    return { message: 'Veuillez entrer un titre valide' };
  } else if (
    !tax ||
    !isValue(tax?.rate?.toString() || '') ||
    (tax?.rate || 0) <= 0 ||
    (tax?.rate || 0) > 1
  ) {
    return { message: 'Veuillez entrer un taux valide' };
  }
  return { message: '' };
};

export const tax = { findPaginated, find, create, update, remove, validate };

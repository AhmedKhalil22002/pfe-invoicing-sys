import axios from './axios';
import { PagedResponse } from './response';
import { Tax } from './types/tax';

export type CreateTaxDto = Pick<Tax, 'label' | 'rate' | 'isSpecial'>;
export type UpdateTaxDto = Pick<Tax, 'label' | 'rate' | 'isSpecial' | 'id'>;
export type PagedTax = PagedResponse<Tax>;

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  search: string = '',
  strict: boolean = false
): Promise<PagedTax> => {
  const response = await axios.get<PagedTax>(
    `public/tax/list?sort[${sortKey}]=${order}&filters[${sortKey}]=${search}&strictMatching[${sortKey}]=${strict}&pageOptions[page]=${page}&pageOptions[take]=${size}`
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

export const tax = { findPaginated, find, create, update, remove };

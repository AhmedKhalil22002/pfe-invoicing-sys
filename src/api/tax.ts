import axios from './axios';
import { PagedResponse } from './response';
import { Tax } from './types/tax';

export type CreateTaxDto = Pick<Tax, 'label' | 'rate' | 'isSpecial'>;
export type UpdateTaxDto = Pick<Tax, 'label' | 'rate' | 'isSpecial' | 'id'>;
export type PagedTax = PagedResponse<Tax>;

const find = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC'
): Promise<PagedTax> => {
  const response = await axios.get<PagedTax>(
    'public/tax/list' + `?order=${order}&page=${page}&take=${size}`
  );
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

export const tax = { find, create, update, remove };

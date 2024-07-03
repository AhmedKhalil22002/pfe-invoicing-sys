import { Quotation } from './types/quotation';
import { PagedResponse } from './response';
import axios from './axios';

export type CreateQuotationDto = Omit<Quotation, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateQuotationDto = Omit<Quotation, 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type PagedQuotation = PagedResponse<Quotation>;

const find = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  search: string = '',
  strict: boolean = false
): Promise<PagedQuotation> => {
  const response = await axios.get<PagedQuotation>(
    `public/quotation/list?sort${sortKey}=${order}&filters${sortKey}=${search}&strictMatching${sortKey}=${strict}&pageOptions[page]=${page}&pageOptions[take]=${size}`
  );
  return response.data;
};

const create = async (quotation: CreateQuotationDto): Promise<Quotation> => {
  const response = await axios.post<Quotation>('public/quotation', quotation);
  return response.data;
};

const update = async (quotation: UpdateQuotationDto): Promise<Quotation> => {
  const response = await axios.put<Quotation>(`public/quotation/${quotation.id}`, quotation);
  return response.data;
};

const remove = async (id: number) => {
  const { data, status } = await axios.delete<Quotation>(`public/quotation/${id}`);
  return { data, status };
};

export const quotation = { find, create, update, remove };

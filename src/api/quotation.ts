import { Quotation, QUOTATION_STATUS } from './types/quotation';
import { PagedResponse } from './response';
import axios from './axios';
import { ToastValidation } from './types';
import { differenceInDays } from 'date-fns';

export type CreateQuotationDto = Omit<Quotation, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type UpdateQuotationDto = Omit<Quotation, 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type PagedQuotation = PagedResponse<Quotation>;

const factory = (): CreateQuotationDto => {
  return {
    date: '',
    dueDate: '',
    status: QUOTATION_STATUS.Draft,
    generalConditions: '',
    total: 0,
    subTotal: 0,
    discount: 0,
    currencyId: 0,
    firmId: 0,
    interlocutorId: 0,
    notes: '',
    articles: []
  };
};

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

const findOne = async (id: number): Promise<Quotation> => {
  const response = await axios.get<Quotation>(`public/quotation/${id}?relationSelect=true`);
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

const validate = (quotation: Partial<Quotation>): ToastValidation => {
  if (!quotation.date) return { message: 'La date est obligatoire' };
  if (!quotation.dueDate) return { message: "L'échéance est obligatoire" };
  if (!quotation.object) return { message: "L'objet est obligatoire" };
  if (differenceInDays(new Date(quotation.date), new Date(quotation.dueDate)) >= 0)
    return { message: "L'échéance doit être supérieure à la date" };
  if (!quotation.firmId || !quotation.interlocutorId)
    return { message: 'Entreprise et interlocuteur sont obligatoire' };

  return { message: '' };
};

export const quotation = { factory, find, findOne, create, update, remove, validate };

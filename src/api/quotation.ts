import axios from './axios';
import {
  CreateQuotationDto,
  PagedQuotation,
  Quotation,
  QUOTATION_STATUS,
  UpdateQuotationDto
} from './types/quotation';
import { ArticleQuotationEntry, ToastValidation } from './types';
import { differenceInDays } from 'date-fns';
import { DiscountType } from './enums/discount-types';

const factory = (): CreateQuotationDto => {
  return {
    date: '',
    dueDate: '',
    status: QUOTATION_STATUS.Draft,
    generalConditions: '',
    total: 0,
    subTotal: 0,
    discount: 0,
    discount_type: DiscountType.AMOUNT,
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
  strict: boolean = false,
  firmId?: number,
  interlocutorId?: number
): Promise<PagedQuotation> => {
  let baseUrl = `public/quotation/list?sort${sortKey}=${order}&filters${sortKey}=${search}&strictMatching${sortKey}=${strict}&pageOptions[page]=${page}&pageOptions[take]=${size}`;
  if (firmId) baseUrl = baseUrl.concat(`&filters[firmId]=${firmId}`);
  if (interlocutorId) baseUrl = baseUrl.concat(`&filters[interlocutorId]=${interlocutorId}`);
  const response = await axios.get<PagedQuotation>(baseUrl);
  return response.data;
};

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  searchKey: string = 'name',
  search: string = '',
  relations: string[] = ['firm', 'interlocutor'],
  firmId?: number,
  interlocutorId?: number
): Promise<PagedQuotation> => {
  const response = await axios.get<PagedQuotation>(
    `public/quotation/list?sort=${sortKey},${order}&filter=${searchKey}||$cont||${search}&limit=${size}&page=${page}&join=${relations.join(',')}`
  );
  return response.data;
};

const findOne = async (
  id: number,
  relations: string[] = [
    'firm',
    'firm.interlocutorsToFirm',
    'interlocutor',
    'articleQuotationEntries',
    'articleQuotationEntries.articleQuotationEntryTaxes',
    'articleQuotationEntries.articleQuotationEntryTaxes.tax'
  ]
): Promise<Quotation> => {
  const response = await axios.get<Quotation>(`public/quotation/${id}?join=${relations.join(',')}`);
  const quotation = response.data;
  return {
    ...quotation,
    articles: quotation.articles?.map((article) => {
      return {
        ...article,
        taxes: article?.articleQuotationEntryTaxes
      };
    })
  };
};

const create = async (quotation: CreateQuotationDto): Promise<Quotation> => {
  const response = await axios.post<Quotation>('public/quotation', quotation);
  return response.data;
};

const copy = (quotation: Quotation): Quotation => {
  return {
    date: quotation.date,
    dueDate: quotation.dueDate,
    status: QUOTATION_STATUS.Draft,
    object: quotation.object,
    generalConditions: quotation.generalConditions,
    discount: quotation.discount,
    discount_type: quotation.discount_type,
    currencyId: quotation.currencyId,
    firmId: quotation.firmId,
    interlocutorId: quotation.interlocutorId,
    notes: quotation.notes,
    articles: quotation.articles?.map((article: ArticleQuotationEntry) => {
      return {
        article: article.article,
        quantity: article.quantity,
        unit_price: article.unit_price,
        taxes: article.articleQuotationEntryTaxes,
        discount: article.discount,
        discount_type: article.discount_type
      };
    })
  };
};

const duplicate = async (id: number): Promise<Quotation> => {
  const quotation = await findOne(id);
  const data = copy(quotation);
  const response = await axios.post<Quotation>('public/quotation', data);
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

export const quotation = {
  factory,
  findPaginated,
  findOne,
  create,
  duplicate,
  update,
  remove,
  validate
};

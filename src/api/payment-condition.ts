import axios from './axios';
import { isAlphabeticOrSpace } from '@/utils/validations/string.validations';
import {
  CreatePaymentConditionDto,
  PagedPaymentCondition,
  PaymentCondition,
  ToastValidation,
  UpdatePaymentConditionDto
} from '@/types';

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  searchKey: string = 'label',
  search: string = ''
): Promise<PagedPaymentCondition> => {
  const response = await axios.get<PagedPaymentCondition>(
    `public/payment-condition/list?sort=${sortKey},${order}&filter=${searchKey}||$cont||${search}&limit=${size}&page=${page}`
  );
  return response.data;
};

const find = async (): Promise<PaymentCondition[]> => {
  const response = await axios.get<PaymentCondition[]>('public/payment-condition/all');
  return response.data;
};

const create = async (paymentMethod: CreatePaymentConditionDto): Promise<PaymentCondition> => {
  const response = await axios.post<PaymentCondition>('public/payment-condition', paymentMethod);
  return response.data;
};

const update = async (paymentMethod: UpdatePaymentConditionDto): Promise<PaymentCondition> => {
  const response = await axios.put<PaymentCondition>(
    `public/payment-condition/${paymentMethod.id}`,
    paymentMethod
  );
  return response.data;
};

const validate = (
  paymentCondition: CreatePaymentConditionDto | UpdatePaymentConditionDto
): ToastValidation => {
  if (
    paymentCondition &&
    paymentCondition?.label &&
    paymentCondition?.label?.length > 3 &&
    isAlphabeticOrSpace(paymentCondition?.label)
  ) {
    return { message: '' };
  }
  return { message: 'Veuillez entrer un titre valide' };
};

const remove = async (id: number) => {
  const { data, status } = await axios.delete<PaymentCondition>(`public/payment-condition/${id}`);
  return { data, status };
};

export const paymentCondition = { find, findPaginated, create, update, validate, remove };

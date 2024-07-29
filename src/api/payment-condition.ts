import axios from './axios';
import { PagedResponse } from './response';
import { PaymentCondition } from './types/payment-condition';

export interface CreatePaymentConditionDto
  extends Pick<PaymentCondition, 'label' | 'description' | 'isDeleteRestricted'> {}
export interface UpdatePaymentConditionDto
  extends Pick<PaymentCondition, 'label' | 'description' | 'id' | 'isDeleteRestricted'> {}
export interface PagedPaymentCondition extends PagedResponse<PaymentCondition> {}

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  search: string = '',
  strict: boolean = false
): Promise<PagedPaymentCondition> => {
  const response = await axios.get<PagedPaymentCondition>(
    `public/payment-condition/list?sort[${sortKey}]=${order}&filters[${sortKey}]=${search}&strictMatching[${sortKey}]=${strict}&pageOptions[page]=${page}&pageOptions[take]=${size}`
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

const remove = async (id: number) => {
  const { data, status } = await axios.delete<PaymentCondition>(`public/payment-condition/${id}`);
  return { data, status };
};

export const paymentCondition = { find, findPaginated, create, update, remove };

import { PAYMENT_FILTER_ATTRIBUTES } from '@/constants/payment-filter.attributes';
import { CreatePaymentDto, PagedPayment, Payment, ToastValidation } from '@/types';
import axios from './axios';

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string,
  search: string = '',
  relations: string[] = [],
  firmId?: number,
  interlocutorId?: number
): Promise<PagedPayment> => {
  const generalFilter = search
    ? Object.values(PAYMENT_FILTER_ATTRIBUTES)
        .map((key) => `${key}||$cont||${search}`)
        .join('||$or||')
    : '';
  const firmCondition = firmId ? `firmId||$eq||${firmId}` : '';
  const interlocutorCondition = interlocutorId ? `interlocutorId||$cont||${interlocutorId}` : '';
  const filters = [generalFilter, firmCondition, interlocutorCondition].filter(Boolean).join(',');

  const response = await axios.get<PagedPayment>(
    new String().concat(
      'public/payment/list?',
      `sort=${sortKey},${order}&`,
      `filter=${filters}&`,
      `limit=${size}&page=${page}&`,
      `join=${relations.join(',')}`
    )
  );
  return response.data;
};

const create = async (payment: CreatePaymentDto, files: File[] = []): Promise<Payment> => {
  const response = await axios.post<CreatePaymentDto>('public/payment', {
    ...payment
  });
  return response.data;
};

const remove = async (id: number): Promise<Payment> => {
  const response = await axios.delete<Payment>(`public/payment/${id}`);
  return response.data;
};

const validate = (payment: Partial<Payment>, used: number): ToastValidation => {
  if ((payment.amount ?? 0) - (payment.fee ?? 0) !== used)
    return { message: 'Le montant total doit être égal à la somme des montants des factures' };

  return { message: '' };
};

export const payment = { findPaginated, create, remove, validate };

import { PagedResponse } from './response';

export interface PaymentCondition {
  id?: number;
  label?: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}
export interface CreatePaymentConditionDto
  extends Pick<PaymentCondition, 'label' | 'description'> {}
export interface UpdatePaymentConditionDto
  extends Pick<PaymentCondition, 'label' | 'description' | 'id'> {}
export interface PagedPaymentCondition extends PagedResponse<PaymentCondition> {}

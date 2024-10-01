import { DefaultCondition, UpdateDefaultConditionDto } from '@/types';
import axios from './axios';

const find = async (): Promise<DefaultCondition[]> => {
  const response = await axios.get('public/default-condition/all');
  return response.data;
};

const update = async (
  defaultCondition: UpdateDefaultConditionDto | UpdateDefaultConditionDto[]
): Promise<DefaultCondition | DefaultCondition[]> => {
  const response = await axios.put<DefaultCondition | DefaultCondition[]>(
    Array.isArray(defaultCondition)
      ? 'public/default-condition/batch-update/'
      : `public/default-condition/${defaultCondition.id}`,
    defaultCondition
  );
  return response.data;
};

export const defaultCondition = { find, update };

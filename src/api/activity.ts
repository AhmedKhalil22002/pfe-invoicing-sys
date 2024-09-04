import { Activity } from './types/activity';
import { PagedResponse } from './response';
import axios from './axios';
import { isAlphabeticOrSpace } from '@/utils/validations/string.validations';
import { ToastValidation } from './types';

export interface CreateActivityDto extends Pick<Activity, 'label' | 'isDeletionRestricted'> {}
export interface UpdateActivityDto
  extends Pick<Activity, 'label' | 'id' | 'isDeletionRestricted'> {}
export interface PagedActivity extends PagedResponse<Activity> {}

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  searchKey: string = 'label',
  search: string = ''
): Promise<PagedActivity> => {
  const response = await axios.get<PagedActivity>(
    `public/activity/list?sort=${sortKey},${order}&filter=${searchKey}||$cont||${search}&limit=${size}&page=${page}`
  );
  return response.data;
};

const find = async (): Promise<Activity[]> => {
  const response = await axios.get('public/activity/all');
  return response.data;
};

const create = async (activity: CreateActivityDto): Promise<Activity> => {
  const response = await axios.post<Activity>('public/activity', activity);
  return response.data;
};

const update = async (activity: UpdateActivityDto): Promise<Activity> => {
  const response = await axios.put<Activity>(`public/activity/${activity.id}`, activity);
  return response.data;
};

const validate = (activity: CreateActivityDto | UpdateActivityDto): ToastValidation => {
  if (activity?.label && activity.label.length > 3 && isAlphabeticOrSpace(activity?.label)) {
    return { message: '' };
  }
  return { message: "Etiquette de l'activité est invalide" };
};

const remove = async (id: number) => {
  const { data, status } = await axios.delete<Activity>(`public/activity/${id}`);
  return { data, status };
};

export const activity = { find, findPaginated, create, update, validate, remove };

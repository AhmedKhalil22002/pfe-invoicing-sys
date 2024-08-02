import { Activity } from './types/activity';
import { PagedResponse } from './response';
import axios from './axios';

export interface CreateActivityDto extends Pick<Activity, 'label' | 'isDeleteRestricted'> {}
export interface UpdateActivityDto extends Pick<Activity, 'label' | 'id' | 'isDeleteRestricted'> {}
export interface PagedActivity extends PagedResponse<Activity> {}

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  search: string = '',
  strict: boolean = false
): Promise<PagedActivity> => {
  const response = await axios.get<PagedActivity>(
    `public/activity/list?sort[${sortKey}]=${order}&filters[${sortKey}]=${search}&strictMatching[${sortKey}]=${strict}&pageOptions[page]=${page}&pageOptions[take]=${size}`
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

const remove = async (id: number) => {
  const { data, status } = await axios.delete<Activity>(`public/activity/${id}`);
  return { data, status };
};

export const activity = { find, findPaginated, create, update, remove };

import { Activity } from './types/activity';
import { PagedResponse } from './response';
import axios from './axios';

export type CreateActivityDto = Pick<Activity, 'label'>;
export type UpdateActivtyDto = Pick<Activity, 'label' | 'id'>;
export type PagedActivity = PagedResponse<Activity>;

const find = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC'
): Promise<PagedActivity> => {
  const response = await axios.get<PagedActivity>(
    'public/activity/list' + `?order=${order}&page=${page}&take=${size}`
  );
  return response.data;
};

const create = async (activity: CreateActivityDto): Promise<Activity> => {
  const response = await axios.post<Activity>('public/activity', activity);
  return response.data;
};

const update = async (activity: UpdateActivtyDto): Promise<Activity> => {
  const response = await axios.put<Activity>(`public/activity/${activity.id}`, activity);
  return response.data;
};

const remove = async (id: number) => {
  const { data, status } = await axios.delete<Activity>(`public/activity/${id}`);
  return { data, status };
};

export const activity = { find, create, update, remove };

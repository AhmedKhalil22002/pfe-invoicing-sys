import axios from 'axios';
import { Activity } from './types/activity';
import { PagedResponse } from './response';

export type CreateActivityDto = Pick<Activity, 'label'>;
export type PagedActivity = PagedResponse<Activity>;

const find = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC'
): Promise<PagedActivity> => {
  const response = await axios.get<PagedResponse<Activity>>(
    'http://localhost:3000/public/activity/list' + `?order=${order}&page=${page}&take=${size}`
  );
  return response.data;
};

const create = async (activity: CreateActivityDto): Promise<Activity> => {
  const response = await axios.post<Activity>('http://localhost:3000/public/activity', activity);
  return response.data;
};

const remove = async (id: number) => {
  const { data, status } = await axios.delete<Activity>(
    `http://localhost:3000/public/activity/${id}`
  );
  return { data, status };
};

export const activity = { find, create, remove };

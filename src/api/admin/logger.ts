import { Log, PagedLogs } from '@/types';
import axios from '../axios';

const findPaginated = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  searchKey: string = 'id',
  search: string = '',
  relations: string[] = ['user']
): Promise<PagedLogs> => {
  const response = await axios.get<PagedLogs>(
    `admin/logger/list?sort=${sortKey},${order}&filter=${searchKey}||$cont||${search}&limit=${size}&page=${page}&join=${relations.join(',')}`
  );
  return response.data;
};

const findPaginatedAfterSpecificDate = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  triggerDate?: string,
  relations: string[] = ['user']
): Promise<PagedLogs> => {
  const response = await axios.get<PagedLogs>(`admin/logger/list`, {
    params: {
      filter: triggerDate ? `loggedAt||$lte||${triggerDate}` : '',
      sort: `${sortKey},${order}`,
      page,
      limit: size,
      join: relations.join(',')
    }
  });
  return response.data;
};

const find = async (): Promise<Log[]> => {
  const response = await axios.get('admin/logger/all?join=user');
  return response.data;
};

export const logger = { find, findPaginated, findPaginatedAfterSpecificDate };

import axios from './axios';
import { PagedResponse } from './response';
import { Firm } from './types/firm';

export type PagedFirm = PagedResponse<Firm>;

const find = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  search: string = '',
  strict: boolean = false
): Promise<PagedFirm> => {
  const response = await axios.get<PagedFirm>(`public/firm/all?sort${sortKey}=${order}&filters${sortKey}=${search}&strictMatching${sortKey}=${strict}&pageOptions[page]=${page}&pageOptions[take]=${size}`);
  return response.data;
};

export const firm = { find };

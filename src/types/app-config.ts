import { DATE_FORMAT } from './enums/date-formats';

export interface AppConfig<T = any> {
  id?: number;
  key?: string;
  value?: T;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface Sequential {
  dynamicSequence: DATE_FORMAT;
  next: number;
  prefix: string;
}

export interface CreateAppConfigDto
  extends Omit<
    AppConfig,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeletionRestricted'
  > {}
export interface UpdateAppConfigDto extends Omit<CreateAppConfigDto, 'name'> {
  id: number;
}

export interface QuotationSequentialNumber extends AppConfig<Sequential> {}

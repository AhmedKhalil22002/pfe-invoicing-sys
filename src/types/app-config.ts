export interface AppConfig<T = any> {
  id?: number;
  key?: string;
  value?: T;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface CreateAppConfigDto
  extends Omit<
    AppConfig,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeletionRestricted'
  > {}
export interface UpdateAppConfigDto extends Omit<CreateAppConfigDto, 'name'> {
  id: number;
}

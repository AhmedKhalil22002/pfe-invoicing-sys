export interface AppConfig<T = any> {
  id?: number;
  key?: string;
  value?: T;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleteRestricted?: boolean;
}

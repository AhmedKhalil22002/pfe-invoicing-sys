export interface Tax {
  id?: number;
  label?: string;
  rate?: number;
  isSpecial?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleteRestricted?: boolean;
}

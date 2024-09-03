import { Country } from './country';

export interface Address {
  id?: number;
  address?: string;
  address2?: string;
  region?: string;
  zipcode?: string;
  country?: Country;
  countryId?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

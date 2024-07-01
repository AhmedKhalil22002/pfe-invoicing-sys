import { Country } from './country';

export type Address = {
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
};

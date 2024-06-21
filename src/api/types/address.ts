import { Country } from './country';

export type Address = {
  address: string;
  address2: string;
  region: string;
  zipcode: string;
  country: Country;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

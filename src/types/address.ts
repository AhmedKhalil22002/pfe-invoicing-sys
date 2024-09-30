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

export type AddressType = 'invoicingAddress' | 'deliveryAddress' | '';
// export interface CreateAddressDto extends Omit<Address, 'createdAt' | 'updatedAt' | 'deletedAt' | 'country' | 'id'>{}
export interface UpdateAddressDto
  extends Omit<
    Address,
    'createdAt' | 'updatedAt' | 'deletedAt' | 'country' | 'id' | 'isDeletionRestricted'
  > {}

import { ToastValidation } from './types';
import { Address } from './types/address';

export type AddressType = 'invoicingAddress' | 'deliveryAddress' | '';
// export type CreateAddressDto = Omit<Address, 'createdAt' | 'updatedAt' | 'deletedAt' | 'country' | 'id'>;

const factory = (): Address => {
  return {
    address: '',
    address2: '',
    region: '',
    zipcode: '',
    countryId: -1
  };
};

const validate = (address: Address): ToastValidation => {
  if (address.address=='') return { message: 'Adresse est obligatoire' };
  return { message: '' };
};

export const address = { factory, validate };

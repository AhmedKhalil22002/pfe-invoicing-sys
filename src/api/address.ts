import { ToastValidation } from './types';
import { Address } from './types/address';

export type AddressType = 'invoicingAddress' | 'deliveryAddress' | '';
// export type CreateAddressDto = Omit<Address, 'createdAt' | 'updatedAt' | 'deletedAt' | 'country' | 'id'>;
export type UpdateAddressDto = Omit<
  Address,
  'createdAt' | 'updatedAt' | 'deletedAt' | 'country' | 'id' | 'isDeleteRestricted'
>;

const factory = (): Address => {
  return {
    address: '',
    address2: '',
    region: '',
    zipcode: '',
    countryId: 1
  };
};

const validate = (address: Partial<Address>): ToastValidation => {
  if (address.address == '') return { message: 'Adresse est obligatoire' };
  if (address?.zipcode && isNaN(+address.zipcode))
    return { message: 'Code postal doit être un nombre' };
  if (address?.zipcode && address.zipcode.length > 5)
    return { message: 'Code postal doit avoir 5 chiffres au maximum' };
  return { message: '' };
};

export const address = { factory, validate };

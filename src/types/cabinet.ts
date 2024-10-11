import { Activity } from './activity';
import { Address, UpdateAddressDto } from './address';
import { Currency } from './currency';

export interface Cabinet {
  id?: number;
  enterpriseName?: string;
  email?: string;
  phone?: string;
  taxIdNumber?: string;
  activity?: Activity;
  activityId?: number;
  currency?: Currency;
  currencyId?: number;
  address?: Address;
  logo?: File;
  logoId?: number;
  signature?: File;
  signatureId?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface UpdateCabinetDto
  extends Omit<
    Cabinet,
    | 'activity'
    | 'currency'
    | 'address'
    | 'createdAt'
    | 'updatedAt'
    | 'deletedAt'
    | 'isDeletionRestricted'
  > {
  address?: UpdateAddressDto;
}

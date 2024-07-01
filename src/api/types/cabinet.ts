import { Activity } from './activity';
import { Address } from './address';
import { Currency } from './currency';

export type Cabinet = {
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
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
};

import { interlocutor } from '../interlocutor';
import { Activity } from './activity';
import { Address } from './address';
import { Cabinet } from './cabinet';
import { Currency } from './currency';
import { Interlocutor } from './interlocutor';
import { PaymentCondition } from './payment-condition';

export type Firm = {
  id?: number;
  website?: string;
  name?: string;
  taxIdNumber?: string;
  isPerson?: boolean;
  invoicingAddress?: Address;
  invoicingAddressId?: number;
  deliveryAddress?: Address;
  deliveryAddressId?: number;
  cabinet?: Cabinet;
  cabinetId?: number;
  activity?: Activity;
  activityId?: number;
  currency?: Currency;
  currencyId?: number;
  mainInterlocutor?: Interlocutor;
  mainInterlocutorId?: number;
  interlocutors?: Interlocutor[];
  paymentCondition?: PaymentCondition;
  paymentConditionId?: number;
  notes?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleteRestricted?: boolean;
};

export const FIRM_COLUMNS = [
  {
    code: 'firm.attributes.entreprise_name',
    key: '[name]',
    default: true,
    canBeSearch: true
  },
  {
    code: 'firm.attributes.main_interlocurtor_name',
    key: '[mainInterlocutor][name]',
    default: true,
    canBeSearch: true
  },
  {
    code: 'interlocutor.attributes.phone',
    key: '[mainInterlocutor][phone]',
    default: true,
    canBeSearch: true
  },
  {
    code: 'firm.attributes.website',
    key: '[website]',
    default: true,
    canBeSearch: true
  },
  {
    code: 'firm.attributes.tax_number',
    key: '[taxIdNumber]',
    default: false,
    canBeSearch: true
  },
  {
    code: 'firm.attributes.type',
    key: '[isPerson]',
    default: false,
    canBeSearch: false
  },
  {
    code: 'firm.attributes.activity',
    key: '[activity][label]',
    default: true,
    canBeSearch: true
  },
  {
    code: 'firm.attributes.currency',
    key: '[currency][label]',
    default: true,
    canBeSearch: true
  },
  {
    code: 'firm.attributes.created_at',
    key: '[createdAt]',
    default: false,
    canBeSearch: true
  }
];

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
};

export const FIRM_COLUMNS = [
  {
    name: "Nom de l'entreprise",
    key: '[name]',
    default: true,
    canBeSearch: true
  },
  {
    name: "Nom de l'interlocuteur principal",
    key: '[mainInterlocutor][name]',
    default: true,
    canBeSearch: true
  },
  {
    name: 'Teléphone',
    key: '[mainInterlocutor][phone]',
    default: true,
    canBeSearch: true
  },
  {
    name: 'Site Web',
    key: '[website]',
    default: true,
    canBeSearch: true
  },
  {
    name: "Numéro d'indentification fiscale",
    key: '[taxIdNumber]',
    default: false,
    canBeSearch: true
  },
  {
    name: 'Personne Morale',
    key: '[isPerson]',
    default: false,
    canBeSearch: false
  },
  {
    name: 'Activité',
    key: '[activity][label]',
    default: true,
    canBeSearch: true
  },
  {
    name: 'Devise',
    key: '[currency][label]',
    default: true,
    canBeSearch: true
  },
  {
    name: 'Date de Création',
    key: '[createdAt]',
    default: false,
    canBeSearch: true
  }
];

import { Activity } from './activity';
import { Address } from './address';
import { Cabinet } from './cabinet';
import { Currency } from './currency';
import { Interlocutor } from './interlocutor';

export type Firm = {
  id: number;
  website: string;
  name: string;
  taxIdNumber: string;
  isPerson: boolean;
  invoicingAddress: Address;
  invoicingAddressId: number;
  deliveryAddress: Address;
  deliveryAddressId: number;
  cabinet: Cabinet;
  cabinetId: number;
  activity: Activity;
  activityId: number;
  currency: Currency;
  currencyId: number;
  mainInterlocutor: Interlocutor;
  mainInterlocutorId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export const firmColumns = [
  {
    name: 'Nom de Firm',
    key: '[name]',
    default: true
  },
  {
    name: 'Nom Complet',
    key: '[mainInterlocutor][name]',
    default: true
  },
  {
    name: 'Teléphone',
    key: '[mainInterlocutor][phone]',
    default: true
  },
  {
    name: 'Site Web',
    key: '[website]',
    default: false
  },
  {
    name: "Numéro d'indentification fiscale",
    key: '[taxIdNumber]',
    default: false
  },
  {
    name: 'Personne Morale',
    key: '[isPerson]',
    default: false
  },
  {
    name: 'Activité',
    key: '[activity][label]',
    default: true
  },
  {
    name: 'Devise',
    key: '[currency][label]',
    default: false
  }
];

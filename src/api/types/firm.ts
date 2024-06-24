import { Activity } from './activity';
import { Address } from './address';
import { Cabinet } from './cabinet';
import { Currency } from './currency';

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
  currecncy: Currency;
  currencyId: number;
  createdAt: string;
  updatedAt: string;
  deletedAt: string;
};

export const firmColumns = [
  {
    name: 'Nom',
    key: 'name',
    default: true
  },
  {
    name: 'Site Web',
    key: 'website',
    default: true
  },
  {
    name: "Numéro d'indentification fiscale",
    key: 'taxIdNumber',
    default: false
  },
  {
    name: 'Personne Morale',
    key: 'isPerson',
    default: false
  },
  {
    name: 'Activité',
    key: 'activity',
    default: true
  },
  {
    name: 'Devise',
    key: 'currency',
    default: false
  }
];

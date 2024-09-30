import { PagedResponse } from './response';

export interface Tax {
  id?: number;
  label?: string;
  rate?: number;
  isSpecial?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface TaxEntry {
  id?: number;
  articleQuotationEntryId?: number;
  tax?: Tax;
  taxId?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface CreateTaxDto
  extends Pick<Tax, 'label' | 'rate' | 'isSpecial' | 'isDeletionRestricted'> {}
export interface UpdateTaxDto
  extends Pick<Tax, 'label' | 'rate' | 'isSpecial' | 'id' | 'isDeletionRestricted'> {}
export interface PagedTax extends PagedResponse<Tax> {}

import { PagedResponse } from './response';

export interface Tax {
  id?: number;
  label?: string;
  value?: number;
  isRate?: boolean;
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
  extends Omit<Tax, 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeletionRestricted'> {}
export interface UpdateTaxDto extends CreateTaxDto {
  id?: number;
}
export interface PagedTax extends PagedResponse<Tax> {}

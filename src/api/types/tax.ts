export interface Tax {
  id?: number;
  label?: string;
  rate?: number;
  isSpecial?: boolean;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleteRestricted?: boolean;
}

export interface TaxEntry {
  id?: number;
  articleQuotationEntryId?: number;
  tax?: Tax;
  taxId?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleteRestricted?: boolean;
}

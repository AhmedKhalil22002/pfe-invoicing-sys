import { PagedResponse } from './response';

export interface TaxWithholding {
  id?: number;
  label?: string;
  rate?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface CreateTaxWithholdingDto
  extends Omit<TaxWithholding, 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeletionRestricted'> {}
export interface UpdateTaxWithholdingDto extends CreateTaxWithholdingDto {
  id?: number;
}
export interface PagedTaxWithholding extends PagedResponse<CreateTaxWithholdingDto> {}

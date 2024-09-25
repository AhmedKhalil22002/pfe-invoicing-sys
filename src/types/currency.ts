export interface Currency {
  id?: number;
  label?: string;
  code?: string;
  symbol?: string;
  digitAfterComma?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

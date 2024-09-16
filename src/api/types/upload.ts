export interface Upload {
  id?: number;
  slug?: string;
  filename?: string;
  relativePath?: string;
  mimetype?: string;
  size: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

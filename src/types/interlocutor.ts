import { FirmInterlocutorEntry } from './firm-interlocutor-entry';
import { PagedResponse } from './response';

export interface Interlocutor {
  id?: number;
  title?: string;
  name?: string;
  surname?: string;
  email?: string;
  phone?: string;
  firmsToInterlocutor?: FirmInterlocutorEntry[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface CreateInterlocutorDto
  extends Omit<
    Interlocutor,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeletionRestricted'
  > {}

export interface UpdateInterlocutorDto
  extends Omit<Interlocutor, 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeletionRestricted'> {}
export type InterlocutorQueryKeyParams = { [P in keyof Interlocutor]?: boolean };
export interface PagedInterlocutor extends PagedResponse<Interlocutor> {}

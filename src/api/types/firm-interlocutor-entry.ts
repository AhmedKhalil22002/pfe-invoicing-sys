import { Interlocutor } from './interlocutor';

export interface FirmInterlocutorEntry {
  id?: number;
  firmId?: number;
  interlocutor?: Interlocutor;
  interlocutorId?: number;
  isMain?: boolean;
  position?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeleteRestricted?: boolean;
}

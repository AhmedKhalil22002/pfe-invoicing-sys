import { Firm } from './firm';
import { Interlocutor } from './interlocutor';

export interface FirmInterlocutorEntry {
  id?: number;
  firmId?: number;
  firm?: Firm;
  interlocutor?: Interlocutor;
  interlocutorId?: number;
  isMain?: boolean;
  position?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
  isDeletionRestricted?: boolean;
}

export interface CreateFirmInterlocutorEntryDto
  extends Omit<
    FirmInterlocutorEntry,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeletionRestricted' | 'interlocutor'
  > {}
export interface UpdateFirmInterlocutorEntryDto extends CreateFirmInterlocutorEntryDto {
  id: number;
}

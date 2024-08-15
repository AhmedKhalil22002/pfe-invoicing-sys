import axios from './axios';
import { FirmInterlocutorEntry } from './types/firm-interlocutor-entry';

export interface CreateFirmInterlocutorEntryDto
  extends Omit<
    FirmInterlocutorEntry,
    'id' | 'createdAt' | 'updatedAt' | 'deletedAt' | 'isDeleteRestricted' | 'interlocutor'
  > {}
export interface UpdateFirmInterlocutorEntryDto extends CreateFirmInterlocutorEntryDto {
  id: number;
}

const findOne = async (id: number): Promise<FirmInterlocutorEntry> => {
  const response = await axios.get(`public/firm-interlocutor-entry/${id}`);
  return response.data;
};

const create = async (
  firmInterlocutorEntry: CreateFirmInterlocutorEntryDto
): Promise<FirmInterlocutorEntry> => {
  const response = await axios.post<FirmInterlocutorEntry>(
    'public/firm-interlocutor-entry',
    firmInterlocutorEntry
  );
  return response.data;
};

const update = async (
  firmInterlocutorEntry: UpdateFirmInterlocutorEntryDto
): Promise<FirmInterlocutorEntry> => {
  const response = await axios.put<FirmInterlocutorEntry>(
    `public/firm-interlocutor-entry/${firmInterlocutorEntry.id}`,
    firmInterlocutorEntry
  );
  return response.data;
};

const remove = async (id: number) => {
  const { data, status } = await axios.delete<FirmInterlocutorEntry>(
    `public/firm-interlocutor-entry/${id}`
  );
  return { data, status };
};

export const firmInterlocutorEntry = { findOne, create, update, remove };

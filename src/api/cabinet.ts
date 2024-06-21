import axios from './axios';
import { Cabinet } from './types/cabinet';

export type UpdateCabinetDto = Omit<Cabinet, 'activity' | 'currency'>;

//defined so we can handle the main process
const TEST_CABINET = typeof window !== 'undefined' ? process.env.NEXT_PUBLIC_CABINET_ID : process.env.CABINET_ID;
  

const findOne = async (): Promise<Cabinet> => {
  const response = await axios.get(`public/cabinet/${TEST_CABINET}`);
  return response.data;
};

const update = async (cabinet: UpdateCabinetDto): Promise<Cabinet> => {
  const response = await axios.put<Cabinet>(`public/cabinet/${cabinet.id}`, cabinet);
  return response.data;
};

export const cabinet = { findOne, update };

import axios from './axios';
import { isEmail } from '@/utils/validations/string.validations';
import { address } from './address';
import { Cabinet, ToastValidation, UpdateCabinetDto } from '@/types';

const findOne = async (id: number): Promise<Cabinet> => {
  const response = await axios.get(`public/cabinet/${id}`);
  return response.data;
};

const update = async (cabinet: UpdateCabinetDto): Promise<Cabinet> => {
  const response = await axios.put<Cabinet>(`public/cabinet/${cabinet.id}`, cabinet);
  return response.data;
};

const validate = (cabinet: Cabinet): ToastValidation => {
  if (!cabinet.enterpriseName) return { message: 'Nom du Cabinet est obligatoire' };
  if (!cabinet.email)
    return { message: 'Il est préférable que le champ e-mail soit présent', type: 'warning' };
  if (!isEmail(cabinet?.email || '')) return { message: 'E-mail invalide' };

  if (!cabinet.taxIdNumber) return { message: "Numéro d'idnetification fiscale est obligatoire" };

  const addressValidation = cabinet?.address ? address.validate(cabinet?.address) : undefined;
  if (addressValidation?.message) return addressValidation;
  return { message: '' };
};

export const cabinet = { findOne, update, validate };

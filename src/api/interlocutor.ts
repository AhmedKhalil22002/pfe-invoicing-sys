import { isAlphabeticOrSpace, isEmail } from '@/utils/validations/string.validations';
import { Interlocutor, ToastValidation } from './types';
import axios from './axios';
import { PagedResponse } from './response';

export type CreateInterlocutorDto = Omit<
  Interlocutor,
  'id' | 'createdAt' | 'updatedAt' | 'deletedAt'
>;

export type UpdateInterlocutorDto = Omit<Interlocutor, 'createdAt' | 'updatedAt' | 'deletedAt'>;
export type InterlocutorQueryKeyParams = { [P in keyof Interlocutor]?: boolean };
export type PagedInterlocutor = PagedResponse<Interlocutor>;

const factory = (): Interlocutor => {
  return {
    title: '',
    name: '',
    surname: '',
    email: '',
    phone: ''
  };
};

const find = async (
  page: number = 1,
  size: number = 5,
  order: 'ASC' | 'DESC' = 'ASC',
  sortKey: string = 'id',
  search: string = '',
  strict: boolean = false
): Promise<PagedInterlocutor> => {
  const response = await axios.get<PagedInterlocutor>(
    `public/interlocutor/list?sort${sortKey}=${order}&filters${sortKey}=${search}&strictMatching${sortKey}=${strict}&pageOptions[page]=${page}&pageOptions[take]=${size}&relationSelect=true`
  );
  return response.data;
};

const validate = (interlocutor: Partial<Interlocutor>): ToastValidation => {
  if (!interlocutor.title) return { message: 'Titre est obligatoire' };
  if (!interlocutor.surname) return { message: 'Prénom est obligatoire' };
  if (!isAlphabeticOrSpace(interlocutor.surname))
    return { message: "Le prénom d'inerlocuteur doit être alphabétique" };
  if (!interlocutor.name) return { message: 'Nom est obligatoire' };
  if (!isAlphabeticOrSpace(interlocutor.name))
    return { message: "Le nom d'inerlocuteur doit être alphabétique" };
  // if (!interlocutor.email) return { message: 'Email est obligatoire' }
  if (!interlocutor.email)
    return { message: 'Il est préférable que le champ e-mail soit présent', type: 'warning' };
  if (!isEmail(interlocutor?.email || '')) return { message: 'E-mail invalide' };
  if (!interlocutor.email)
    return { message: 'Il est préférable que le champ télephone soit présent', type: 'warning' };
  return { message: '' };
};

const update = async (interlocutor: UpdateInterlocutorDto): Promise<Interlocutor> => {
  const response = await axios.put<Interlocutor>(
    `public/interlocutor/${interlocutor.id}`,
    interlocutor
  );
  return response.data;
};

const remove = async (id: number) => {
  const { data, status } = await axios.delete<Interlocutor>(`public/interlocutor/${id}`);
  return { data, status };
};

export const interlocutor = { factory, find, update, remove, validate };

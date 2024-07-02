import { Interlocutor, ToastValidation } from './types';

// export type CreateInterlocutorDto = Omit<Interlocutor, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

const factory = (): Interlocutor => {
  return {
    title: '',
    name: '',
    surname: '',
    email: '',
    phone: ''
  };
};

const validate = (interlocutor: Interlocutor): ToastValidation => {
  if (!interlocutor.title) return { message: 'Titre est obligatoire' }
  if (!interlocutor.surname) return { message: 'Prénom est obligatoire' }
  if (!interlocutor.name) return { message: 'Nom est obligatoire' }
  // if (!interlocutor.email) return { message: 'Email est obligatoire' }
  if (!interlocutor.email) return { message: 'Il est préférable que le champ e-mail soit présent', type: 'warning' }
  if (!interlocutor.email) return { message: 'Il est préférable que le champ télephone soit présent', type: 'warning' }
  return { message: '' };
};

export const interlocutor = { factory,validate };

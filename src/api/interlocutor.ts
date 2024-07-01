import { Interlocutor } from './types';

export type CreateInterlocutorDto = Omit<Interlocutor, 'id' | 'createdAt' | 'updatedAt' | 'deletedAt'>;

const factory = (): Interlocutor => {
  return {
    title: '',
    name: '',
    surname: '',
    email: '',
    phone: ''
  };
};

export const interlocutor = { factory };

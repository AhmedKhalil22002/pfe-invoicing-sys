import { Interlocutor, SOCIAL_TITLE } from '@/types';
import { create } from 'zustand';

type InterlocutorManager = {
  // data
  id?: number;
  title?: SOCIAL_TITLE;
  name?: string;
  surname?: string;
  website?: string;
  email?: string;
  phone?: string;
  position?: string;

  // methods
  set: (name: keyof InterlocutorManager, value: any) => void;
  reset: () => void;
  getInterlocutor: () => Partial<Interlocutor>;
  setInterlocutor: (data: Partial<Interlocutor>) => void;
};

const initialState: Omit<
  InterlocutorManager,
  'set' | 'reset' | 'getInterlocutor' | 'setInterlocutor'
> = {
  id: undefined,
  title: SOCIAL_TITLE.MR,
  name: '',
  surname: '',
  website: '',
  email: '',
  phone: '',
  position: ''
};

export const useInterlocutorManager = create<InterlocutorManager>((set, get) => ({
  ...initialState,

  set: (name: keyof InterlocutorManager, value: any) => {
    set((state) => ({
      ...state,
      [name]: value
    }));
  },

  reset: () => {
    set({ ...initialState });
  },

  getInterlocutor: () => {
    const { set, reset, getInterlocutor, ...data } = get();
    return {
      id: data.id,
      title: data.title,
      name: data.name,
      surname: data.surname,
      phone: data.phone,
      email: data.email,
      position: data.position
    };
  },
  setInterlocutor: (data: Partial<Interlocutor>) => {
    set((state) => ({
      ...state,
      id: data.id,
      title: data.title as SOCIAL_TITLE,
      name: data.name,
      surname: data.surname,
      phone: data.phone,
      email: data.email
    }));
  }
}));

import { Interlocutor, SOCIAL_TITLE } from '@/types';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type pseudoItem = { id: string; firmId?: number; position?: string };

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
  entries: pseudoItem[];

  // methods
  add: () => void;
  update: (item: pseudoItem) => void;
  delete: (id: string) => void;
  setFirms: (firmsId: { id?: number; position?: string }[]) => void;
  getFirms: () => { id?: number; position?: string }[];
  set: (name: keyof InterlocutorManager, value: any) => void;
  reset: () => void;
  getInterlocutor: () => Partial<Interlocutor>;
  setInterlocutor: (data: Partial<Interlocutor>) => void;
};

const initialState: Omit<
  InterlocutorManager,
  | 'set'
  | 'reset'
  | 'add'
  | 'update'
  | 'delete'
  | 'setFirms'
  | 'getFirms'
  | 'getInterlocutor'
  | 'setInterlocutor'
> = {
  id: undefined,
  title: SOCIAL_TITLE.MR,
  name: '',
  surname: '',
  website: '',
  email: '',
  phone: '',
  position: '',
  entries: []
};

export const useInterlocutorManager = create<InterlocutorManager>((set, get) => ({
  ...initialState,
  add: () => {
    set((state) => ({
      entries: [...state.entries, { id: uuidv4(), firmId: undefined, position: '' }]
    }));
  },

  update: (item: pseudoItem) => {
    set((state) => ({
      entries: state.entries.map((entry) =>
        entry.id === item.id ? { ...entry, firmId: item.firmId, position: item.position } : entry
      )
    }));
  },

  delete: (id: string) => {
    set((state) => ({
      entries: state.entries.filter((entry) => entry.id !== id)
    }));
  },

  setFirms: (firmsId: { id?: number; position?: string }[]) => {
    set({
      entries: firmsId.map((entry) => ({
        id: uuidv4(),
        firmId: entry.id,
        position: entry.position
      }))
    });
  },

  getFirms: () => {
    return get()
      .entries.map((entry) => {
        return { id: entry.firmId, position: entry.position };
      })
      .filter((entry) => entry.id !== undefined && entry.position !== undefined);
  },

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
      firmsToInterlocutor: data.entries
        .map((entry) => {
          return { firmId: entry.firmId, interlocutorId: data.id, position: entry.position };
        })
        .filter((entry) => entry.firmId !== undefined && entry.position !== undefined)
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
      email: data.email,
      entries: data.firmsToInterlocutor?.map((entry) => {
        return { id: uuidv4(), firmId: entry.firmId, position: entry.position };
      })
    }));
  }
}));

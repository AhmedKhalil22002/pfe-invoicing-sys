import { Firm, Interlocutor, SOCIAL_TITLES } from '@/api';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type pseudoItem = { id: string; firmId?: number | undefined };

type InterlocutorManager = {
  // data
  title?: SOCIAL_TITLES;
  name?: string;
  surname?: string;
  website?: string;
  email?: string;
  phone?: string;
  firms: pseudoItem[];

  // methods
  add: () => void;
  update: (id: string, firmId: number) => void;
  delete: (id: string) => void;
  setFirms: (firmsId: (number | undefined)[]) => void;
  getFirms: () => (number | undefined)[];
  set: (name: keyof InterlocutorManager, value: any) => void;
  reset: () => void;
  mergeData: (id?: number) => Partial<Interlocutor>;
};

const initialState: Omit<
  InterlocutorManager,
  'set' | 'reset' | 'mergeData' | 'add' | 'update' | 'delete' | 'setFirms' | 'getFirms'
> = {
  title: SOCIAL_TITLES.MR,
  name: '',
  surname: '',
  website: '',
  email: '',
  phone: '',
  firms: []
};

export const useInterlocutorManager = create<InterlocutorManager>((set, get) => ({
  ...initialState,
  add: () => {
    set((state) => ({ firms: [...state.firms, { id: uuidv4(), firmId: undefined }] }));
  },
  update: (id: string, firmId: number) => {
    set((state) => ({
      firms: state.firms.map((firm) => (firm.id === id ? { ...firm, firmId } : firm))
    }));
  },
  delete: (id: string) => {
    set((state) => ({
      firms: state.firms.filter((firm) => firm.id !== id)
    }));
  },
  setFirms: (firmsId: (number | undefined)[]) => {
    set({
      firms: firmsId.map((firmId) => ({ id: uuidv4(), firmId }))
    });
  },
  getFirms: () => {
    return get()
      .firms.map((firm) => firm.firmId)
      .filter((firmId) => firmId !== undefined) as number[];
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
  mergeData: (id?: number) => {
    const { set, reset, mergeData, ...data } = get();
    return {
      id,
      title: data.title,
      name: data.name,
      surname: data.surname,
      phone: data.phone,
      email: data.email,
      firms: data.firms
        .map((firm) => firm.firmId)
        .filter((firmId) => firmId !== undefined) as number[]
    };
  }
}));

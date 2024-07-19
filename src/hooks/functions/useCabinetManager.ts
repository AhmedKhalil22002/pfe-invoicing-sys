import { Activity, Address, Cabinet, Currency } from '@/api';
import { create } from 'zustand';

type CabinetManager = {
  // data
  id?: number;
  enterpriseName?: string;
  email?: string;
  phone?: string;
  taxIdNumber?: string;
  activity?: Activity;
  currency?: Currency;
  // methods
  set: (name: keyof CabinetManager, value: any) => void;
  reset: () => void;
  mergeData: (address?: Address) => Partial<Cabinet>;
};

const initialState: Omit<CabinetManager, 'set' | 'reset' | 'mergeData'> = {
  id: undefined,
  enterpriseName: '',
  email: '',
  phone: '',
  taxIdNumber: '',
  activity: undefined,
  currency: undefined
};

export const useCabinetManager = create<CabinetManager>((set, get) => ({
  ...initialState,
  set: (name: keyof CabinetManager, value: any) => {
    set((state) => ({
      ...state,
      [name]: value
    }));
  },
  reset: () => {
    set({ ...initialState });
  },
  mergeData: (address?: Address) => {
    const { set, reset, mergeData, ...data } = get();
    return {
      id: data.id,
      enterpriseName: data.enterpriseName,
      phone: data?.phone,
      email: data?.email,
      activityId: data?.activity?.id,
      currencyId: data?.currency?.id,
      taxIdNumber: data?.taxIdNumber,
      address
    };
  }
}));

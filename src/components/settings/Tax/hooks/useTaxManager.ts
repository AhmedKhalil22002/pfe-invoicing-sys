import { Tax } from '@/types';
import { create } from 'zustand';

type TaxManager = {
  // data
  id?: number;
  label?: string;
  rate?: number;
  isSpecial?: boolean;
  // methods
  set: (name: keyof TaxManager, value: any) => void;
  reset: () => void;
  getTax: () => Partial<Tax>;
  setTax: (paymentCondition: Partial<Tax>) => void;
};

const initialState: Omit<TaxManager, 'set' | 'reset' | 'getTax' | 'setTax'> = {
  id: 0,
  label: '',
  rate: 0,
  isSpecial: false
};

export const useTaxManager = create<TaxManager>((set, get) => ({
  ...initialState,
  set: (name: keyof TaxManager, value: any) =>
    set((state) => ({
      ...state,
      [name]: value
    })),
  reset: () => set({ ...initialState }),
  getTax: () => {
    const data = get();
    return {
      id: data.id,
      label: data.label,
      rate: data.rate,
      isSpecial: data.isSpecial
    };
  },
  setTax: (paymentCondition: Partial<Tax>) => {
    set((state) => ({
      ...state,
      ...paymentCondition
    }));
  }
}));

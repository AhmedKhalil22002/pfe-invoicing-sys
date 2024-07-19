import { Activity, Address, Currency, Firm, PaymentCondition, SOCIAL_TITLES } from '@/api';
import { create } from 'zustand';

type FirmManager = {
  // data
  title?: SOCIAL_TITLES;
  name?: string;
  surname?: string;
  enterpriseName?: string;
  website?: string;
  email?: string;
  phone?: string;
  isPerson?: boolean;
  taxIdNumber?: string;
  activity?: Activity;
  currency?: Currency;
  paymentCondition?: PaymentCondition;
  notes?: string;
  // methods
  set: (name: keyof FirmManager, value: any) => void;
  reset: () => void;
  mergeData: (invoicingAddress?: Address, deliveryAddress?: Address, id?: number) => Partial<Firm>;
};

const initialState: Omit<FirmManager, 'set' | 'reset' | 'mergeData'> = {
  title: SOCIAL_TITLES.MR,
  name: '',
  surname: '',
  enterpriseName: '',
  website: '',
  email: '',
  phone: '',
  isPerson: true,
  taxIdNumber: '',
  activity: undefined,
  currency: undefined,
  paymentCondition: undefined,
  notes: ''
};

export const useFirmManager = create<FirmManager>((set, get) => ({
  ...initialState,
  set: (name: keyof FirmManager, value: any) => {
    set((state) => ({
      ...state,
      [name]: value
    }));
  },
  reset: () => {
    set({ ...initialState });
  },
  mergeData: (invoicingAddress?: Address, deliveryAddress?: Address, id?: number) => {
    const { set, reset, mergeData, ...data } = get();
    return {
      id,
      name: data.enterpriseName,
      mainInterlocutor: {
        title: data?.title,
        name: data?.name,
        surname: data?.surname,
        phone: data?.phone,
        email: data?.email
      },
      activityId: data?.activity?.id,
      currencyId: data?.currency?.id,
      paymentConditionId: data?.paymentCondition?.id,
      invoicingAddress,
      deliveryAddress,
      isPerson: data?.isPerson,
      website: data?.website,
      taxIdNumber: data?.taxIdNumber,
      notes: data?.notes
    };
  }
}));

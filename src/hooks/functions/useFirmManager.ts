import { Activity, Address, Currency, PaymentCondition, SOCIAL_TITLES } from '@/api';
import { create } from 'zustand';

type FirmManager = {
  // data
  id?: number;
  title?: SOCIAL_TITLES;
  name?: string;
  surname?: string;
  entrepriseName?: string;
  website?: string;
  email?: string;
  phone?: string;
  isPerson?: boolean;
  taxIdNumber?: string;
  activity?: Activity;
  currency?: Currency;
  paymentCondition?: PaymentCondition;
  notes?: string;
  // utility data
  // methods
  set: (name: keyof FirmManager, value: any) => void;
  reset: () => void;
  mergeData: (
    invoicingAddress?: Address,
    deliveryAddress?: Address,
    id?: number
  ) => Omit<FirmManager, 'set' | 'reset' | 'mergeData'>;
};

const initialState: Omit<FirmManager, 'set' | 'reset' | 'mergeData'> = {
  // data
  id: undefined,
  title: SOCIAL_TITLES.MR,
  name: '',
  surname: '',
  entrepriseName: '',
  website: '',
  email: '',
  phone: '',
  isPerson: true,
  taxIdNumber: '',
  activity: undefined,
  currency: undefined,
  paymentCondition: undefined,
  notes: ''
  // utility data
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
    // console.log(get());
    set({ ...initialState });
  },
  mergeData: (invoicingAddress?: Address, deliveryAddress?: Address, id?: number) => {
    const { set, reset, mergeData, ...data } = get();
    return {
      id,
      name: data.entrepriseName,
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

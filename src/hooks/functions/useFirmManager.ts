import {
  Activity,
  Address,
  CreateFirmDto,
  Currency,
  PaymentCondition,
  SOCIAL_TITLE,
  UpdateFirmDto
} from '@/api';
import { create } from 'zustand';

type FirmManager = {
  // data
  title?: SOCIAL_TITLE;
  name?: string;
  surname?: string;
  enterpriseName?: string;
  position?: string;
  website?: string;
  entreprisePhone?: string;
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
  mergeData: (
    invoicingAddress?: Address,
    deliveryAddress?: Address,
    id?: number
  ) => CreateFirmDto | UpdateFirmDto;
};

const initialState: Omit<FirmManager, 'set' | 'reset' | 'mergeData'> = {
  title: SOCIAL_TITLE.MR,
  name: '',
  surname: '',
  enterpriseName: '',
  website: '',
  entreprisePhone: '',
  email: '',
  phone: '',
  isPerson: false,
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
        email: data?.email,
        position: data?.position
      },
      activityId: data?.activity?.id,
      currencyId: data?.currency?.id,
      paymentConditionId: data?.paymentCondition?.id,
      invoicingAddress,
      deliveryAddress,
      isPerson: data?.isPerson,
      website: data?.website,
      phone: data?.entreprisePhone,
      ...(data?.isPerson ? {} : { taxIdNumber: data?.taxIdNumber }),
      notes: data?.notes
    } as CreateFirmDto | UpdateFirmDto;
  }
}));

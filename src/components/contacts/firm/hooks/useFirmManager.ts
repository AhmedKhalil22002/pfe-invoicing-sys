import { Activity, Address, Currency, Firm, PaymentCondition, SOCIAL_TITLE } from '@/types';
import { create } from 'zustand';

type FirmManager = {
  // data
  id?: number;
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
  invoicingAddress?: Address;
  deliveryAddress?: Address;
  // methods
  set: (name: keyof FirmManager, value: any) => void;
  setFirm: (firm: Firm) => void;
  reset: () => void;
  getFirm: () => Firm;
};

const initialState: Omit<FirmManager, 'set' | 'setFirm' | 'reset' | 'getFirm'> = {
  id: undefined,
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
  notes: '',
  invoicingAddress: undefined,
  deliveryAddress: undefined,
  position: ''
};

export const useFirmManager = create<FirmManager>((set, get) => ({
  ...initialState,
  set: (name: keyof FirmManager, value: any) => {
    set((state) => ({
      ...state,
      [name]: value
    }));
  },
  setFirm: (firm: Firm) => {
    const mainInterlocutor = firm?.interlocutorsToFirm?.find((interlocutor) => interlocutor.isMain);
    set((state) => ({
      ...state,
      id: firm?.id,
      title: mainInterlocutor?.interlocutor?.title as SOCIAL_TITLE,
      name: mainInterlocutor?.interlocutor?.name,
      surname: mainInterlocutor?.interlocutor?.surname,
      enterpriseName: firm?.name,
      website: firm?.website,
      entreprisePhone: firm?.phone,
      email: mainInterlocutor?.interlocutor?.email,
      phone: mainInterlocutor?.interlocutor?.phone,
      position: mainInterlocutor?.position,
      isPerson: firm?.isPerson,
      taxIdNumber: firm?.taxIdNumber,
      activity: firm?.activity,
      currency: firm?.currency,
      paymentCondition: firm?.paymentCondition,
      notes: firm?.notes,
      invoicingAddress: firm?.invoicingAddress,
      deliveryAddress: firm?.deliveryAddress
    }));
  },
  getFirm: () => {
    const { set, reset, ...data } = get();
    return {
      id: data.id,
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
      isPerson: data?.isPerson,
      website: data?.website,
      phone: data?.entreprisePhone,
      ...(data?.isPerson ? {} : { taxIdNumber: data?.taxIdNumber }),
      notes: data?.notes,
      invoicingAddress: data?.invoicingAddress,
      deliveryAddress: data?.deliveryAddress
    } as Firm;
  },
  reset: () => set((state) => ({ ...state, ...initialState }))
}));

import { Firm, PAYMENT_MODE, Payment, PaymentUploadedFile } from '@/types';
import { create } from 'zustand';

type PaymentManager = {
  // data
  id?: number;
  date?: Date | undefined;
  amount?: number;
  fee?: number;
  currencyId?: number;
  notes?: string;
  mode?: PAYMENT_MODE;
  uploadedFiles?: PaymentUploadedFile[];
  //utility
  firmId?: number;
  // methods
  set: (name: keyof PaymentManager, value: any) => void;
  getPayment: () => Partial<PaymentManager>;
  setPayment: (payment: Partial<Payment & { files: PaymentUploadedFile[] }>) => void;
  reset: () => void;
};

const initialState: Omit<PaymentManager, 'set' | 'reset' | 'getPayment' | 'setPayment'> = {
  id: -1,
  date: undefined,
  amount: 0,
  fee: 0,
  currencyId: undefined,
  notes: '',
  mode: PAYMENT_MODE.Cash,
  uploadedFiles: [],
  firmId: undefined
};

export const usePaymentManager = create<PaymentManager>((set, get) => ({
  ...initialState,
  set: (name: keyof PaymentManager, value: any) => {
    if (name === 'date') {
      const dateValue = typeof value === 'string' ? new Date(value) : value;
      set((state) => ({
        ...state,
        [name]: dateValue
      }));
    } else {
      set((state) => ({
        ...state,
        [name]: value
      }));
    }
  },
  getPayment: () => {
    const { id, date, amount, mode, notes, uploadedFiles, ...rest } = get();

    return {
      id,
      date,
      amount,
      notes,
      uploadedFiles
    };
  },
  setPayment: (payment: Partial<Payment & { files: PaymentUploadedFile[] }>) => {
    set((state) => ({
      ...state,
      id: payment?.id,
      date: payment?.date ? new Date(payment?.date) : undefined,
      amount: payment?.amount,
      notes: payment?.notes,
      mode: payment?.mode,
      firmId: payment?.firmId,
      currencyId: payment?.currencyId,
      uploadedFiles: payment?.files || []
    }));
  },
  reset: () => set({ ...initialState })
}));

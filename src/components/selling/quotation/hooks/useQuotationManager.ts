import { BankAccount, Firm, Interlocutor, QUOTATION_STATUS, SequentialNumber, api } from '@/api';
import { DATE_FORMAT } from '@/api/enums/date-formats';
import { DISCOUNT_TYPE } from '@/api/enums/discount-types';
import { create } from 'zustand';

type QuotationManager = {
  // data
  id?: number;
  sequentialNumber: SequentialNumber;
  date: Date | undefined;
  dueDate: Date | undefined;
  object: string;
  firm?: Firm;
  interlocutor?: Interlocutor;
  subTotal: number;
  total: number;
  taxStamp: number;
  discount: number;
  discountType: DISCOUNT_TYPE;
  bankAccount?: BankAccount;
  notes: string;
  status: QUOTATION_STATUS;
  generalConditions: string;
  // utility data
  isInterlocutorInFirm: boolean;
  // methods
  setFirm: (firm?: Firm) => void;
  setInterlocutor: (interlocuteur?: Interlocutor) => void;
  set: (name: keyof QuotationManager, value: any) => void;
  reset: () => void;
};

const initialState: Omit<QuotationManager, 'set' | 'reset' | 'setFirm' | 'setInterlocutor'> = {
  id: -1,
  sequentialNumber: {
    prefix: '',
    dynamic_sequence: DATE_FORMAT.YYYY,
    next: 0
  },
  date: undefined,
  dueDate: undefined,
  object: '',
  firm: api.firm.factory(),
  interlocutor: api.interlocutor.factory(),
  subTotal: 0,
  total: 0,
  taxStamp: 0,
  discount: 0,
  discountType: DISCOUNT_TYPE.PERCENTAGE,
  bankAccount: api.bankAccount.factory(),
  notes: '',
  status: QUOTATION_STATUS.Nonexistent,
  generalConditions: '',
  isInterlocutorInFirm: false
};

export const useQuotationManager = create<QuotationManager>((set, get) => ({
  ...initialState,
  setFirm: (firm?: Firm) =>
    set((state) => ({
      ...state,
      firm,
      interlocutor: undefined,
      isInterlocutorInFirm: false
    })),
  setInterlocutor: (interlocuteur?: Interlocutor) =>
    set((state) => ({
      ...state,
      interlocutor: interlocuteur,
      isInterlocutorInFirm: true
    })),
  set: (name: keyof QuotationManager, value: any) =>
    set((state) => ({
      ...state,
      [name]: value
    })),
  reset: () => set({ ...initialState })
}));

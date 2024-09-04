import { BankAccount, Currency, Firm, Interlocutor, QUOTATION_STATUS, api } from '@/api';
import { DATE_FORMAT } from '@/api/enums/date-formats';
import { DISCOUNT_TYPE } from '@/api/enums/discount-types';
import { create } from 'zustand';

type QuotationManager = {
  // data
  id?: number;
  sequentialNumber: {
    dynamicSequence: DATE_FORMAT;
    next: number;
    prefix: string;
  };
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
  currency?: Currency;
  notes: string;
  status: QUOTATION_STATUS;
  generalConditions: string;
  // utility data
  isInterlocutorInFirm: boolean;
  // methods
  setFirm: (firm?: Firm) => void;
  setInterlocutor: (interlocuteur?: Interlocutor) => void;
  set: (name: keyof QuotationManager, value: any) => void;
  getQuotation: () => Omit<
    QuotationManager,
    'set' | 'reset' | 'setFirm' | 'setInterlocutor' | 'getQuotation'
  >;
  reset: () => void;
};

const initialState: Omit<
  QuotationManager,
  'set' | 'reset' | 'setFirm' | 'setInterlocutor' | 'getQuotation'
> = {
  id: -1,
  sequentialNumber: {
    prefix: '',
    dynamicSequence: DATE_FORMAT.yy_MM,
    next: 0
  },
  date: new Date(),
  dueDate: new Date(),
  object: '',
  firm: api.firm.factory(),
  interlocutor: api.interlocutor.factory(),
  subTotal: 0,
  total: 0,
  taxStamp: 0,
  discount: 0,
  discountType: DISCOUNT_TYPE.PERCENTAGE,
  bankAccount: api.bankAccount.factory(),
  currency: api.currency.factory(),
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
  getQuotation: () => {
    return get();
  },
  reset: () => set({ ...initialState })
}));

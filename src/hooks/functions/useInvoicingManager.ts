import { BankAccount, Firm, Interlocutor, QUOTATION_STATUS, api } from '@/api';
import { DiscountType } from '@/api/enums/discount-types';
import { create } from 'zustand';

type InvoicingManager = {
  // data
  id?: number;
  date: Date | undefined;
  dueDate: Date | undefined;
  object: string;
  firm?: Firm;
  interlocutor?: Interlocutor;
  subTotal: number;
  total: number;
  taxStamp: number;
  discount: number;
  discountType: DiscountType;
  bankAccount?: BankAccount;
  notes: string;
  status: QUOTATION_STATUS;
  generalConditions: string;
  // utility data
  isInterlocutorInFirm: boolean;
  // methods
  setFirm: (firm?: Firm) => void;
  setInterlocutor: (interlocuteur?: Interlocutor) => void;
  set: (name: keyof InvoicingManager, value: any) => void;
  reset: () => void;
};

const initialState: Omit<InvoicingManager, 'set' | 'reset' | 'setFirm' | 'setInterlocutor'> = {
  id: -1,
  date: undefined,
  dueDate: undefined,
  object: '',
  firm: api.firm.factory(),
  interlocutor: api.interlocutor.factory(),
  subTotal: 0,
  total: 0,
  taxStamp: 0,
  discount: 0,
  discountType: DiscountType.PERCENTAGE,
  bankAccount: api.bankAccount.factory(),
  notes: '',
  status: QUOTATION_STATUS.Nonexistent,
  generalConditions: '',
  isInterlocutorInFirm: false
};

export const useInvoicingManager = create<InvoicingManager>((set, get) => ({
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
  set: (name: keyof InvoicingManager, value: any) =>
    set((state) => ({
      ...state,
      [name]: value
    })),
  reset: () => set({ ...initialState })
}));

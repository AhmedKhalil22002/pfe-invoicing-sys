import { api } from '@/api';
import {
  BankAccount,
  Currency,
  Firm,
  Interlocutor,
  PaymentCondition,
  QUOTATION_STATUS
} from '@/types';
import { DATE_FORMAT } from '@/types/enums/date-formats';
import { DISCOUNT_TYPE } from '@/types/enums/discount-types';
import { create } from 'zustand';

type QuotationManager = {
  // data
  id?: number;
  sequentialNumber: {
    dynamicSequence: DATE_FORMAT;
    next: number;
    prefix: string;
  };
  sequential: string;
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
  files: File[];
  // utility data
  isInterlocutorInFirm: boolean;
  // methods
  setFirm: (firm?: Firm) => void;
  setInterlocutor: (interlocutor?: Interlocutor) => void;
  set: (name: keyof QuotationManager, value: any) => void;
  getQuotation: () => Partial<QuotationManager>;
  setQuotation: (quotation: Partial<QuotationManager>) => void;
  reset: () => void;
};

const getDateRangeAccordingToPaymentConditions = (paymentCondition: PaymentCondition) => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  if (!paymentCondition) return { date: undefined, dueDate: undefined };

  switch (paymentCondition.id) {
    case 1:
      return { date: today, dueDate: today };
    case 2:
      return { date: today, dueDate: new Date(year, month + 1, 0) }; // End of current month
    case 3:
      return { date: today, dueDate: new Date(year, month + 2, 0) }; // End of next month
    case 4:
      return { date: today, dueDate: undefined };
    default:
      return { date: undefined, dueDate: undefined };
  }
};

const initialState: Omit<
  QuotationManager,
  'set' | 'reset' | 'setFirm' | 'setInterlocutor' | 'getQuotation' | 'setQuotation'
> = {
  id: -1,
  sequentialNumber: {
    prefix: '',
    dynamicSequence: DATE_FORMAT.yy_MM,
    next: 0
  },
  sequential: '',
  date: undefined,
  dueDate: undefined,
  object: '',
  firm: api?.firm?.factory() || undefined, // Safely call the factory method
  interlocutor: api?.interlocutor?.factory() || undefined, // Safely call the factory method
  subTotal: 0,
  total: 0,
  taxStamp: 0,
  discount: 0,
  discountType: DISCOUNT_TYPE.PERCENTAGE,
  bankAccount: api?.bankAccount?.factory() || undefined, // Safely call the factory method
  currency: api?.currency?.factory() || undefined, // Safely call the factory method
  notes: '',
  status: QUOTATION_STATUS.Nonexistent,
  generalConditions: '',
  isInterlocutorInFirm: false,
  files: []
};

export const useQuotationManager = create<QuotationManager>((set, get) => ({
  ...initialState,
  setFirm: (firm?: Firm) => {
    const dateRange = firm?.paymentCondition
      ? getDateRangeAccordingToPaymentConditions(firm.paymentCondition)
      : { date: undefined, dueDate: undefined };

    set((state) => ({
      ...state,
      firm,
      interlocutor:
        firm?.interlocutorsToFirm?.length === 1
          ? firm.interlocutorsToFirm[0]
          : api?.interlocutor?.factory() || undefined, // Safely call the factory method
      isInterlocutorInFirm: !!firm?.interlocutorsToFirm?.length, // Set true if interlocutors exist
      date: dateRange.date,
      dueDate: dateRange.dueDate
    }));
  },
  setInterlocutor: (interlocutor?: Interlocutor) =>
    set((state) => ({
      ...state,
      interlocutor,
      isInterlocutorInFirm: true
    })),
  set: (name: keyof QuotationManager, value: any) => {
    // Ensure the date and dueDate are of type Date
    if (name === 'date' || name === 'dueDate') {
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
  getQuotation: () => {
    const {
      date,
      dueDate,
      object,
      firm,
      interlocutor,
      discount,
      discountType,
      taxStamp,
      notes,
      generalConditions,
      bankAccount,
      currency,
      ...rest
    } = get();

    return {
      date,
      dueDate,
      object,
      firmId: firm?.id,
      interlocutorId: interlocutor?.id,
      discount,
      discountType,
      taxStamp,
      notes,
      generalConditions,
      bankAccountId: bankAccount?.id,
      currencyId: currency?.id
    };
  },
  setQuotation: (quotation: Partial<QuotationManager>) => {
    set((state) => ({
      ...state,
      ...quotation
    }));
  },
  reset: () => set({ ...initialState })
}));

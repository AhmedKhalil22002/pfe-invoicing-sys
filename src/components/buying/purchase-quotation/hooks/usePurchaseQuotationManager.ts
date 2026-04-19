import { api } from '@/api';
import {

  Currency,
  Firm,
  Interlocutor,
  PaymentCondition,
  PURCHASE_QUOTATION_STATUS,
  PurchaseQuotation,
  PurchaseQuotationUploadedFile,
  ResponseBankAccountDto
} from '@/types';
import { DateFormat } from '@/types/enums/date-formats';
import { DISCOUNT_TYPE } from '@/types/enums/discount-types';
import { fromStringToSequentialObject } from '@/utils/string.utils';
import { create } from 'zustand';

type PurchaseQuotationManager = {
  // data
  id?: number;
  sequentialNumber: {
    dateFormat: DateFormat;
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
  discount: number;
  discountType: DISCOUNT_TYPE;
  bankAccount?: Partial<ResponseBankAccountDto>;
  currency?: Currency;
  notes: string;
  status: PURCHASE_QUOTATION_STATUS;
  generalConditions: string;
  uploadedFiles: PurchaseQuotationUploadedFile[];
  purchaseInvoices: PurchaseInvoice[];
  // utility data
  isInterlocutorInFirm: boolean;
  // methods
  setFirm: (firm?: Firm) => void;
  setInterlocutor: (interlocutor?: Interlocutor) => void;
  set: (name: keyof PurchaseQuotationManager, value: any) => void;
  getPurchaseQuotation: () => Partial<PurchaseQuotationManager>;
  setPurchaseQuotation: (
    purchaseQuotation: Partial<PurchaseQuotation & { files: PurchaseQuotationUploadedFile[] }>,
    firms?: Firm[],
    bankAccounts?:  ResponseBankAccountDto []
  ) => void;
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
  PurchaseQuotationManager,
  'set' | 'reset' | 'setFirm' | 'setInterlocutor' | 'getPurchaseQuotation' | 'setPurchaseQuotation'
> = {
  id: -1,
  sequentialNumber: {
    prefix: '',
    dateFormat: DateFormat.YYMM,
    next: 0
  },
  sequential: '',
  date: undefined,
  dueDate: undefined,
  object: '',
  firm: api?.firm?.factory() || undefined,
  interlocutor: api?.interlocutor?.factory() || undefined,
  subTotal: 0,
  total: 0,
  discount: 0,
  discountType: DISCOUNT_TYPE.PERCENTAGE,
  bankAccount: api?.bankAccount?.factory() || undefined,
  currency: api?.currency?.factory() || undefined,
  notes: '',
  status: PURCHASE_QUOTATION_STATUS.Nonexistent,
  generalConditions: '',
  isInterlocutorInFirm: false,
  uploadedFiles: [],
  purchaseInvoices: []
};

export const usePurchaseQuotationManager = create<PurchaseQuotationManager>((set, get) => ({
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
          : api?.interlocutor?.factory() || undefined,
      isInterlocutorInFirm: !!firm?.interlocutorsToFirm?.length,
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
  set: (name: keyof PurchaseQuotationManager, value: any) => {
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
  getPurchaseQuotation: () => {
    const {
      id,
      sequentialNumber,
      date,
      dueDate,
      object,
      firm,
      interlocutor,
      discount,
      discountType,
      notes,
      generalConditions,
      bankAccount,
      currency,
      uploadedFiles,
      ...rest
    } = get();

    return {
      id,
      sequentialNumber,
      date,
      dueDate,
      object,
      firmId: firm?.id,
      interlocutorId: interlocutor?.id,
      discount,
      discountType,
      notes,
      generalConditions,
      bankAccountId: bankAccount?.id,
      currencyId: currency?.id,
      uploadedFiles
    };
  },
  setPurchaseQuotation: (
    purchaseQuotation: Partial<PurchaseQuotation & { files: PurchaseQuotationUploadedFile[] }>,
    firms?: Firm[],
    bankAccounts?:  ResponseBankAccountDto []
  ) => {
    set((state) => ({
      ...state,
      id: purchaseQuotation?.id,
      sequentialNumber: fromStringToSequentialObject(purchaseQuotation?.sequential || ''),
      date: purchaseQuotation?.date ? new Date(purchaseQuotation?.date) : undefined,
      dueDate: purchaseQuotation?.dueDate ? new Date(purchaseQuotation?.dueDate) : undefined,
      object: purchaseQuotation?.object,
      firm: firms?.find((firm) => purchaseQuotation?.firm?.id === firm.id),
      interlocutor: purchaseQuotation?.interlocutor,
      discount: purchaseQuotation?.discount,
      discountType: purchaseQuotation?.discount_type,
      bankAccount: purchaseQuotation?.bankAccount,
      currency: purchaseQuotation?.currency || purchaseQuotation?.firm?.currency,
      notes: purchaseQuotation?.notes,
      generalConditions: purchaseQuotation?.generalConditions,
      status: purchaseQuotation?.status,
      uploadedFiles: purchaseQuotation?.files || [],
      purchaseInvoices: purchaseQuotation?.purchaseInvoices || []
    }));
  },
  reset: () => set({ ...initialState })
}));
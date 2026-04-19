import { api } from '@/api';
import {
  BankAccount,
  Currency,
  Firm,
  PURCHASE_INVOICE_STATUS,
  Interlocutor,
  PurchaseInvoice,
  PurchaseInvoiceUploadedFile,
  PaymentCondition
} from '@/types';
import { DateFormat } from '@/types/enums/date-formats';
import { DISCOUNT_TYPE } from '@/types/enums/discount-types';
import { fromStringToSequentialObject } from '@/utils/string.utils';
import { create } from 'zustand';

type PurchaseInvoiceManager = {
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
  amountPaid: number;
  discount: number;
  discountType: DISCOUNT_TYPE;
  bankAccount?: BankAccount;
  currency?: Currency;
  notes: string;
  status: PURCHASE_INVOICE_STATUS;
  generalConditions: string;
  uploadedFiles: PurchaseInvoiceUploadedFile[];
  purchaseQuotationId?: number;
  taxStampId?: number;
  taxWithholdingId?: number;
  // utility data
  isInterlocutorInFirm: boolean;
  // methods
  setFirm: (firm?: Firm) => void;
  setInterlocutor: (interlocutor?: Interlocutor) => void;
  set: (name: keyof PurchaseInvoiceManager, value: any) => void;
  getPurchaseInvoice: () => Partial<PurchaseInvoiceManager>;
  setPurchaseInvoice: (
    purchaseInvoice: Partial<PurchaseInvoice & { files: PurchaseInvoiceUploadedFile[] }>,
    firms: Firm[],
    bankAccounts: BankAccount[]
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
  PurchaseInvoiceManager,
  'set' | 'reset' | 'setFirm' | 'setInterlocutor' | 'getPurchaseInvoice' | 'setPurchaseInvoice'
> = {
  id: undefined,
  sequentialNumber: {
    prefix: '',
    dateFormat: DateFormat.YYYYMM,
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
  amountPaid: 0,
  discount: 0,
  discountType: DISCOUNT_TYPE.PERCENTAGE,
  bankAccount: api?.bankAccount?.factory() || undefined,
  currency: api?.currency?.factory() || undefined,
  notes: '',
  status: PURCHASE_INVOICE_STATUS.Nonexistent,
  generalConditions: '',
  isInterlocutorInFirm: false,
  uploadedFiles: [],
  purchaseQuotationId: undefined,
  taxStampId: undefined,
  taxWithholdingId: undefined
};

export const usePurchaseInvoiceManager = create<PurchaseInvoiceManager>((set, get) => ({
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
  set: (name: keyof PurchaseInvoiceManager, value: any) => {
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
  getPurchaseInvoice: () => {
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
      taxStampId,
      taxWithholdingId,
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
      uploadedFiles,
      taxStampId,
      taxWithholdingId
    };
  },
  setPurchaseInvoice: (
    purchaseInvoice: Partial<PurchaseInvoice & { files: PurchaseInvoiceUploadedFile[] }>,
    firms: Firm[],
    bankAccounts: BankAccount[]
  ) => {
    set((state) => ({
      ...state,
      id: purchaseInvoice?.id,
      sequentialNumber: fromStringToSequentialObject(purchaseInvoice?.sequential || ''),
      date: purchaseInvoice?.date ? new Date(purchaseInvoice?.date) : undefined,
      dueDate: purchaseInvoice?.dueDate ? new Date(purchaseInvoice?.dueDate) : undefined,
      object: purchaseInvoice?.object,
      firm: firms.find((firm) => purchaseInvoice?.firm?.id === firm.id),
      interlocutor: purchaseInvoice?.interlocutor,
      discount: purchaseInvoice?.discount,
      discountType: purchaseInvoice?.discount_type,
      bankAccount: purchaseInvoice?.bankAccount || bankAccounts.find((a) => a.isMain),
      currency: purchaseInvoice?.currency || purchaseInvoice?.firm?.currency,
      notes: purchaseInvoice?.notes,
      generalConditions: purchaseInvoice?.generalConditions,
      status: purchaseInvoice?.status,
      uploadedFiles: purchaseInvoice?.files || [],
      purchaseQuotationId: purchaseInvoice?.purchaseQuotationId,
      taxStampId: purchaseInvoice?.taxStampId,
      amountPaid: purchaseInvoice?.amountPaid,
      taxWithholdingId: purchaseInvoice?.taxWithholdingId,
      taxWithholdingAmount: purchaseInvoice?.taxWithholdingAmount
    }));
  },
  reset: () => set({ ...initialState })
}));

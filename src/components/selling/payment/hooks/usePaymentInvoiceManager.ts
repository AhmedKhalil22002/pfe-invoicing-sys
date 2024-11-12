import { PaymentInvoiceEntry } from '@/types';
import { approximateNumber } from '@/utils/number.utils';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type PaymentPseudoItem = { id: string; invoice: PaymentInvoiceEntry };

export type PaymentInvoiceManager = {
  invoices: PaymentPseudoItem[];
  add: (invoice?: PaymentInvoiceEntry) => void;
  update: (id: string, article: PaymentInvoiceEntry) => void;
  delete: (id: string) => void;
  setInvoices: (invoices: PaymentInvoiceEntry[]) => void;
  reset: () => void;
  getInvoices: () => PaymentInvoiceEntry[];
  calculateUsedAmount: () => number;
};

export const usePaymentInvoiceManager = create<PaymentInvoiceManager>()((set, get) => ({
  invoices: [],

  add: (invoice: PaymentInvoiceEntry = {} as PaymentInvoiceEntry) => {
    set((state) => ({
      invoices: [...state.invoices, { id: uuidv4(), invoice }]
    }));
  },

  update: (id: string, invoice: PaymentInvoiceEntry) => {
    set((state) => ({
      invoices: state.invoices.map((a) => (a.id === id ? { ...a, invoice } : a))
    }));
  },

  delete: (id: string) => {
    set((state) => ({
      invoices: state.invoices.filter((a) => a.id !== id)
    }));
  },

  setInvoices: (invoices: PaymentInvoiceEntry[]) => {
    set({
      invoices: invoices.map((invoice) => {
        return {
          id: uuidv4(),
          invoice
        };
      })
    });
  },

  reset: () =>
    set({
      invoices: []
    }),

  getInvoices: () => {
    return get().invoices.map((item) => {
      return item.invoice;
    });
  },
  calculateUsedAmount: (digitsAfterComma: number = 2) => {
    const invoices = get().invoices.map((i) => i.invoice);
    return invoices.reduce((acc, invoice) => {
      return acc + approximateNumber(invoice?.amount ?? 0, digitsAfterComma);
    }, 0);
  }
}));

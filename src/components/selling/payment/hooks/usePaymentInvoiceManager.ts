import { Currency, PaymentInvoiceEntry } from '@/types';
import { ciel } from '@/utils/number.utils';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type PaymentPseudoItem = { id: string; invoice: PaymentInvoiceEntry };

export type PaymentInvoiceManager = {
  invoices: PaymentPseudoItem[];
  add: (invoice?: PaymentInvoiceEntry) => void;
  update: (id: string, article: PaymentInvoiceEntry) => void;
  delete: (id: string) => void;
  setInvoices: (
    entries: PaymentInvoiceEntry[],
    currency: Currency,
    convertionRate: number,
    mode?: 'EDIT' | 'NEW'
  ) => void;
  reset: () => void;
  getInvoices: () => PaymentInvoiceEntry[];
  calculateUsedAmount: (digitAfterComma: number) => number;
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

  setInvoices: (
    entries: PaymentInvoiceEntry[],
    currency: Currency,
    convertionRate: number,
    mode?: 'EDIT' | 'NEW'
  ) => {
    const actualEntries =
      mode === 'EDIT'
        ? entries.map((entry) => {
            const amountPaid = entry?.invoice?.amountPaid || 0;
            const entryAmount = entry?.amount || 0;
            return {
              ...entry,
              invoice: {
                ...entry.invoice,
                amountPaid: amountPaid - entryAmount
              },
              amount:
                currency.id != entry.invoice?.currencyId
                  ? ciel(entryAmount / convertionRate)
                  : entryAmount
            };
          })
        : entries;
    set({
      invoices: actualEntries.map((invoice) => {
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
  calculateUsedAmount: (digitAfterComma: number = 2) => {
    const invoices = get().invoices.map((i) => i.invoice);
    return invoices.reduce((acc, invoice) => {
      return acc + ciel(invoice?.amount ?? 0, digitAfterComma);
    }, 0);
  }
}));

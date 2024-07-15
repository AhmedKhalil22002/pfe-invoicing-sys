import { ArticleEntry, ArticleQuotationEntry, ArticleInvoiceEntry } from '@/api';
import { DiscountType } from '@/api/enums/discount-types';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

export type pseudoItem<T> = { id: string; article: T & { total?: number } }; // Add total field to the type

export type ArticleManager<T> = {
  articles: pseudoItem<T>[];
  add: (article: T) => void;
  update: (id: string, article: T) => void;
  delete: (id: string) => void;
  setArticles: (articles: T[]) => void;
  reset: () => void;
  getArticles: () => (T & { total: number })[];
};

const calculateTotal = (article: ArticleQuotationEntry | ArticleInvoiceEntry) => {
  const quantity = article.quantity || 0;
  const unit_price = article.unit_price || 0;
  const discount = article.discount || 0;
  const discount_type = article.discount_type || DiscountType.PERCENTAGE;

  const subTotal = quantity * unit_price;
  const taxRateSum = article.taxes?.reduce((sum, tax) => sum + (tax?.rate || 0), 0) || 0;
  const discountAmount =
    discount_type === DiscountType.PERCENTAGE ? (subTotal * discount) / 100 : discount;

  const totalAfterDiscount = subTotal - discountAmount;
  const totalAfterTax = totalAfterDiscount + totalAfterDiscount * (taxRateSum / 100); // Adjusted tax calculation
  return totalAfterTax;
};

const createArticleManagerStore = <T extends ArticleEntry>() =>
  create<ArticleManager<T>>()((set, get) => ({
    articles: [],

    add: (article: T) => {
      const total = calculateTotal(article); // Calculate total
      set((state) => ({
        articles: [...state.articles, { id: uuidv4(), article: { ...article, total } }]
      }));
    },

    update: (id: string, article: T) => {
      const total = calculateTotal(article); // Calculate total
      set((state) => ({
        articles: state.articles.map((a) =>
          a.id === id ? { ...a, article: { ...article, total } } : a
        )
      }));
    },

    delete: (id: string) =>
      set((state) => ({
        articles: state.articles.filter((a) => a.id !== id)
      })),

    setArticles: (articles: T[]) =>
      set({
        articles: articles.map((article) => ({
          id: uuidv4(),
          article: { ...article, total: calculateTotal(article) }
        }))
      }),

    reset: () => set({ articles: [] }),

    getArticles: () =>
      get().articles.map((item) => ({
        ...item.article,
        total: calculateTotal(item.article)
      }))
  }));

let quotationArticleManagerStore: ReturnType<typeof createArticleManagerStore> | null = null;
let invoiceArticleManagerStore: ReturnType<typeof createArticleManagerStore> | null = null;

export const useQuotationArticleManager = () => {
  if (!quotationArticleManagerStore) {
    quotationArticleManagerStore = createArticleManagerStore<ArticleQuotationEntry>();
  }
  return quotationArticleManagerStore;
};

export const useInvoiceArticleManager = () => {
  if (!invoiceArticleManagerStore) {
    invoiceArticleManagerStore = createArticleManagerStore<ArticleInvoiceEntry>();
  }
  return invoiceArticleManagerStore;
};

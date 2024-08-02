import { ArticleQuotationEntry } from '@/api';
import { DiscountType } from '@/api/enums/discount-types';
import { v4 as uuidv4 } from 'uuid';
import { create } from 'zustand';

type quotationPseudoItem = { id: string; article: ArticleQuotationEntry & { total?: number } };

export type QuotationArticleManager = {
  articles: quotationPseudoItem[];
  add: (article: ArticleQuotationEntry) => void;
  update: (id: string, article: ArticleQuotationEntry) => void;
  delete: (id: string) => void;
  setArticles: (articles: ArticleQuotationEntry[]) => void;
  reset: () => void;
  getArticles: () => (ArticleQuotationEntry & { total: number })[];
};

const calculateTotalForQuotation = (article: ArticleQuotationEntry) => {
  const quantity = article.quantity || 0;
  const unit_price = article.unit_price || 0;
  const discount = article.discount || 0;
  const discount_type = article.discount_type || DiscountType.PERCENTAGE;

  const subTotal = quantity * unit_price;
  const taxRateSum =
    article.articleQuotationEntryTaxes?.reduce(
      (sum, taxEntry) => sum + (taxEntry?.tax?.rate || 0),
      0
    ) || 0;
  const discountAmount =
    discount_type === DiscountType.PERCENTAGE ? (subTotal * discount) / 100 : discount;

  const totalAfterDiscount = subTotal - discountAmount;
  const totalAfterTax = totalAfterDiscount + totalAfterDiscount * (taxRateSum / 100);
  return totalAfterTax;
};

export const useQuotationArticleManagerStore = create<QuotationArticleManager>()((set, get) => ({
  articles: [],

  add: (article: ArticleQuotationEntry) => {
    const total = calculateTotalForQuotation(article);
    set((state) => ({
      articles: [...state.articles, { id: uuidv4(), article: { ...article, total } }]
    }));
  },

  update: (id: string, article: ArticleQuotationEntry) => {
    const total = calculateTotalForQuotation(article);
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

  setArticles: (articles: ArticleQuotationEntry[]) => {
    set({
      articles: articles.map((article) => ({
        id: uuidv4(),
        article: {
          ...article,
          total: calculateTotalForQuotation(article)
        }
      }))
    });
  },

  reset: () => set({ articles: [] }),

  getArticles: () => {
    return get().articles.map((item) => ({
      ...item.article,
      total: calculateTotalForQuotation(item.article)
    }));
  }
}));

import { ArticleQuotationEntry, Tax } from '@/api';
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

const calculateForQuotation = (article: ArticleQuotationEntry) => {
  const quantity = article?.quantity || 0;
  const unit_price = article?.unit_price || 0;
  const discount = article?.discount || 0;
  const discount_type = article?.discount_type || DiscountType?.PERCENTAGE;

  const subTotal = quantity * unit_price;
  const discountAmount =
    discount_type === DiscountType.PERCENTAGE ? (subTotal * discount) / 100 : discount;

  const subTotalPlusDiscount = subTotal - discountAmount;
  let taxAmount = 0;
  let specialTaxAmount = 0;
  if (article?.articleQuotationEntryTaxes) {
    for (const entry of article?.articleQuotationEntryTaxes) {
      if (entry?.tax?.isSpecial) specialTaxAmount += entry?.tax?.rate || 0;
      else taxAmount += entry?.tax?.rate || 0;
    }
  }
  const total = subTotalPlusDiscount * (1 + taxAmount) * (1 + specialTaxAmount);
  return { subTotalPlusDiscount, total };
};

export const useQuotationArticleManagerStore = create<QuotationArticleManager>()((set, get) => ({
  articles: [],

  add: (article: ArticleQuotationEntry) => {
    const { subTotalPlusDiscount, total } = calculateForQuotation(article);
    set((state) => ({
      articles: [
        ...state.articles,
        { id: uuidv4(), article: { ...article, total, subTotal: subTotalPlusDiscount } }
      ]
    }));
  },

  update: (id: string, article: ArticleQuotationEntry) => {
    const { subTotalPlusDiscount, total } = calculateForQuotation(article);
    set((state) => ({
      articles: state.articles.map((a) =>
        a.id === id ? { ...a, article: { ...article, total, subTotal: subTotalPlusDiscount } } : a
      )
    }));
  },

  delete: (id: string) =>
    set((state) => ({
      articles: state.articles.filter((a) => a.id !== id)
    })),

  setArticles: (articles: ArticleQuotationEntry[]) => {
    set({
      articles: articles.map((article) => {
        const { subTotalPlusDiscount, total } = calculateForQuotation(article);
        return {
          id: uuidv4(),
          article: { ...article, total, subTotal: subTotalPlusDiscount }
        };
      })
    });
  },

  reset: () =>
    set({
      articles: [{ id: uuidv4(), article: {} as ArticleQuotationEntry } as quotationPseudoItem]
    }),

  getArticles: () => {
    return get().articles.map((item) => {
      const { subTotalPlusDiscount, total } = calculateForQuotation(item.article);

      return { ...item.article, total, subTotal: subTotalPlusDiscount };
    });
  }
}));

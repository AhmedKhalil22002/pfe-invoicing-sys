import { ArticleEntry, ArticleQuotationEntry, ArticleInvoiceEntry } from '@/api';
import { create } from 'zustand';

export type pseudoItem<T> = { id: string; Item: T };

export type ArticleManager<T> = {
  articles: pseudoItem<T>[];
  reset: () => void;
};

export const useTypedArticleManager = <T extends ArticleEntry>() =>
  create<ArticleManager<T>>()((set) => ({
    articles: [{} as pseudoItem<T>],

    reset: () =>
      set({
        articles: [{} as pseudoItem<T>]
      })
  }));

export const useQuotationArticleManager = () => {
  const store = useTypedArticleManager<ArticleQuotationEntry>();
  return store();
};
export const useInvoiceArticleManager = () => {
  const store = useTypedArticleManager<ArticleInvoiceEntry>();
  return store();
};

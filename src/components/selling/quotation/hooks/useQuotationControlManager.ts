import { create } from 'zustand';

type QuotationControlManager = {
  isBankAccountDetailsHidden: boolean;
  isInvoiceAddressHidden: boolean;
  isDeliveryAddressHidden: boolean;
  isGeneralConditionsHidden: boolean;
  isTaxStampHidden: boolean;
  isArticleDescriptionHidden: boolean;
  toggle: (field: keyof QuotationControlManager) => void;
  set: (field: keyof QuotationControlManager, value: boolean) => void;
  getControls: () => Omit<QuotationControlManager, 'toggle' | 'set' | 'getControls' | 'reset'>;
  reset: () => void;
};

export const useQuotationControlManager = create<QuotationControlManager>()((set, get) => ({
  isBankAccountDetailsHidden: false,
  isInvoiceAddressHidden: false,
  isDeliveryAddressHidden: false,
  isGeneralConditionsHidden: false,
  isTaxStampHidden: true,
  isArticleDescriptionHidden: false,
  toggle: (field: keyof QuotationControlManager) =>
    set((state) => ({ ...state, [field]: !state[field] })),
  set: (field: keyof QuotationControlManager, value: boolean) =>
    set((state) => ({ ...state, [field]: value })),
  getControls: () => {
    return get();
  },
  reset: () =>
    set({
      isBankAccountDetailsHidden: false,
      isInvoiceAddressHidden: false,
      isDeliveryAddressHidden: false,
      isGeneralConditionsHidden: false,
      isTaxStampHidden: true,
      isArticleDescriptionHidden: false
    })
}));

import { create } from 'zustand';

export type PurchaseQuotationControlManager = {
  isBankAccountDetailsHidden: boolean;
  isInvoiceAddressHidden: boolean;
  isDeliveryAddressHidden: boolean;
  isGeneralConditionsHidden: boolean;
  isArticleDescriptionHidden: boolean;
  toggle: (field: keyof PurchaseQuotationControlManager) => void;
  set: (field: keyof PurchaseQuotationControlManager, value: boolean) => void;
  setControls: (
    data: Omit<PurchaseQuotationControlManager, 'toggle' | 'set' | 'getControls' | 'setControls' | 'reset'>
  ) => void;
  getControls: () => Omit<
    PurchaseQuotationControlManager,
    'toggle' | 'set' | 'getControls' | 'setControls' | 'reset'
  >;
  reset: () => void;
};

export const usePurchaseQuotationControlManager = create<PurchaseQuotationControlManager>()((set, get) => ({
  isBankAccountDetailsHidden: false,
  isInvoiceAddressHidden: false,
  isDeliveryAddressHidden: false,
  isGeneralConditionsHidden: false,
  isArticleDescriptionHidden: false,
  toggle: (field: keyof PurchaseQuotationControlManager) =>
    set((state) => ({ ...state, [field]: !state[field] })),
  set: (field: keyof PurchaseQuotationControlManager, value: boolean) =>
    set((state) => ({ ...state, [field]: value })),
  setControls: (data: any) => {
    set((state) => ({ ...state, ...data }));
  },
  getControls: () => {
    return get();
  },
  reset: () =>
    set({
      isBankAccountDetailsHidden: false,
      isInvoiceAddressHidden: false,
      isDeliveryAddressHidden: false,
      isGeneralConditionsHidden: false,
      isArticleDescriptionHidden: false
    })
}));

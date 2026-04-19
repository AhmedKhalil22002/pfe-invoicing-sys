import { create } from 'zustand';

export type PurchaseInvoiceControlManager = {
  isBankAccountDetailsHidden: boolean;
  isPurchaseInvoiceAddressHidden: boolean;
  isDeliveryAddressHidden: boolean;
  isGeneralConditionsHidden: boolean;
  isArticleDescriptionHidden: boolean;
  isTaxStampHidden: boolean;
  isTaxWithholdingHidden: boolean;
  toggle: (field: keyof PurchaseInvoiceControlManager) => void;
  set: (field: keyof PurchaseInvoiceControlManager, value: boolean) => void;
  setControls: (
    data: Omit<PurchaseInvoiceControlManager, 'toggle' | 'set' | 'getControls' | 'setControls' | 'reset'>
  ) => void;
  getControls: () => Omit<
    PurchaseInvoiceControlManager,
    'toggle' | 'set' | 'getControls' | 'setControls' | 'reset'
  >;
  reset: () => void;
};

export const usePurchaseInvoiceControlManager = create<PurchaseInvoiceControlManager>()((set, get) => ({
  isBankAccountDetailsHidden: false,
  isPurchaseInvoiceAddressHidden: false,
  isDeliveryAddressHidden: false,
  isGeneralConditionsHidden: false,
  isArticleDescriptionHidden: false,
  isTaxStampHidden: false,
  isTaxWithholdingHidden: true,
  toggle: (field: keyof PurchaseInvoiceControlManager) =>
    set((state) => ({ ...state, [field]: !state[field] })),
  set: (field: keyof PurchaseInvoiceControlManager, value: boolean) =>
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
      isPurchaseInvoiceAddressHidden: false,
      isDeliveryAddressHidden: false,
      isGeneralConditionsHidden: false,
      isArticleDescriptionHidden: false,
      isTaxStampHidden: false,
      isTaxWithholdingHidden: true
    })
}));

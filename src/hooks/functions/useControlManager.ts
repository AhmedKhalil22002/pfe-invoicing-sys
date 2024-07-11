import { create } from 'zustand';

type ControlManager = {
  isBankAccountDetailsHidden: boolean;
  isInvoiceAddressHidden: boolean;
  isDeliveryAddressHidden: boolean;
  isGeneralConditionsHidden: boolean;
  isTaxStampHidden: boolean;
  isArticleDescriptionHidden: boolean;
  toggle: (field: keyof ControlManager) => void;
  reset: () => void;
};

export const useControlManager = create<ControlManager>()((set) => ({
  isBankAccountDetailsHidden: false,
  isInvoiceAddressHidden: false,
  isDeliveryAddressHidden: false,
  isGeneralConditionsHidden: false,
  isTaxStampHidden: true,
  isArticleDescriptionHidden: false,
  toggle: (field: keyof ControlManager) => set((state) => ({ ...state, [field]: !state[field] })),
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

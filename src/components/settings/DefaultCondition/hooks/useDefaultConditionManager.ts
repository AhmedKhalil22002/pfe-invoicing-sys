import { DefaultCondition } from '@/types';
import { create } from 'zustand';

type DefaultConditionManager = {
  // data
  defaultConditions: DefaultCondition[];
  propagation: { defaultConditionId: number; checked: boolean }[];
  // methods
  setDefaultConditionById: (id: number, value: string) => void;
  getDefaultConditionById: (id: number) => DefaultCondition | undefined;
  getDefaultConditions: () => DefaultCondition[];
  setDefaultConditions: (defaultConditions: DefaultCondition[]) => void;
  setPropagationById: (defaultConditionId: number, checked: boolean) => void;
  reset: () => void;
};

const initialState: Omit<
  DefaultConditionManager,
  | 'setDefaultConditionById'
  | 'getDefaultConditionById'
  | 'getDefaultConditions'
  | 'setDefaultConditions'
  | 'setPropagationById'
  | 'reset'
> = {
  defaultConditions: [],
  propagation: []
};

export const useDefaultConditionManager = create<DefaultConditionManager>((set, get) => ({
  ...initialState,
  setDefaultConditionById: (id: number, value: string) => {
    const defaultConditions = get().defaultConditions;
    const updatedConditions = defaultConditions.map((condition) =>
      condition.id === id ? { ...condition, value } : condition
    );
    set({ defaultConditions: updatedConditions });
  },

  getDefaultConditionById: (id: number) => {
    const defaultConditions = get().defaultConditions;
    return defaultConditions.find((condition) => condition.id === id);
  },

  getDefaultConditions: () => {
    return get().defaultConditions;
  },

  setDefaultConditions: (defaultConditions: DefaultCondition[]) =>
    set((state) => ({
      ...state,
      defaultConditions
    })),

  setPropagationById: (defaultConditionId: number, checked: boolean) => {
    set((state) => {
      const propagationExists = state.propagation.find(
        (item) => item.defaultConditionId === defaultConditionId
      );

      let updatedPropagation;
      if (propagationExists) {
        updatedPropagation = state.propagation.map((item) =>
          item.defaultConditionId === defaultConditionId ? { ...item, checked } : item
        );
      } else {
        updatedPropagation = [...state.propagation, { defaultConditionId, checked }];
      }

      return { ...state, propagation: updatedPropagation };
    });
  },

  reset: () => set({ ...initialState })
}));

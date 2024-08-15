import { AppConfig, Sequential } from '@/api';
import { DATE_FORMAT } from '@/api/enums/date-formats';
import { create } from 'zustand';
import { SequentialItem } from '../SequentialItem';

interface Data {
  id: number;
  key?: string;
  value: Sequential;
}

type SequentialManager = {
  // data
  sequentials: Data[];
  // methods
  setSequentials: (sequentials: AppConfig[]) => void;
  set: (id: number, attribute: keyof Sequential, value: any) => void;
  reset: () => void;
};

const initialState: Omit<SequentialManager, 'set' | 'reset' | 'setSequentials'> = {
  sequentials: []
};

export const useSequentialsManager = create<SequentialManager>((set) => ({
  ...initialState,
  setSequentials: (sequentials) =>
    set({
      sequentials: sequentials.map((seq) => ({
        id: seq.id || 0,
        key: seq.key,
        value: {
          dynamicSequence: seq.value.dynamicSequence,
          next: seq.value.next,
          prefix: seq.value.prefix
        }
      }))
    }),
  set: (id, attribute, value) => {
    set((state) => {
      const updatedSequentials = state.sequentials.map((seq) => {
        if (seq.id === id) {
          return { ...seq, value: { ...seq.value, [attribute]: value } };
        }
        return seq;
      });
      return { sequentials: updatedSequentials };
    });
  },
  reset: () => set({ sequentials: [] })
}));

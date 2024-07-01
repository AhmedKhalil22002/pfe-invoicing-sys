/* eslint-disable @typescript-eslint/no-explicit-any */
import { capitalize } from '@/utils/string.utils';
import { create } from 'zustand';

export type GroupStateStore<T> = T & { [K in keyof T as `set${Capitalize<string & K>}`]: (value: T[K]) => void }

function useGroupState<T extends Record<string, any>>(initialState: T) {
  const useCustomState = create<GroupStateStore<T>>((set) => {
    const setters = Object.keys(initialState).reduce((acc, key) => {
      const setterName = `set${capitalize(key)}` as keyof T;
      acc[setterName] = (value: T[typeof key]) => set((state) => ({ ...state, [key]: value }));
      return acc;
    }, {} as any);

    return {
      ...initialState,
      ...setters
    };
  });

  return useCustomState;
}

export default useGroupState;

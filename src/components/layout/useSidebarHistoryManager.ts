import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SidebarHistoryData {
  activeCollapsibles: number[];
  lastClickedItem: string;
}

interface SidebarHistoryManager extends SidebarHistoryData {
  addActiveCollapsible: (id: number) => void;
  removeActiveCollapsible: (id: number) => void;
  setLastClickedItem: (item: string) => void;
  reset: () => void;
}

const initialState: SidebarHistoryData = {
  activeCollapsibles: [],
  lastClickedItem: ''
};

export const useSidebarHistoryManager = create<SidebarHistoryManager>()(
  persist(
    (set, get) => ({
      ...initialState,
      addActiveCollapsible: (id) =>
        set((state) => ({
          activeCollapsibles: Array.from(new Set([...state.activeCollapsibles, id]))
        })),
      removeActiveCollapsible: (id) =>
        set((state) => ({
          activeCollapsibles: state.activeCollapsibles.filter((item) => item !== id)
        })),
      setLastClickedItem: (item) => set({ lastClickedItem: item }),
      reset: () => set(initialState)
    }),
    {
      name: 'sidebar-history'
    }
  )
);

import { create } from 'zustand';
import type { Store } from '@/types';
import storesData from '@/data/stores.json';

interface StoreState {
  currentStore: Store | null;
  stores: Store[];
  setCurrentStore: (storeNumber: string) => void;
  initializeStores: () => void;
}

export const useStoreStore = create<StoreState>((set) => ({
  currentStore: null,
  stores: [],
  
  setCurrentStore: (storeNumber: string) => {
    const store = storesData.find(s => s.storeNumber === storeNumber) || null;
    set({ currentStore: store });
  },
  
  initializeStores: () => {
    set({ 
      stores: storesData as Store[],
      currentStore: storesData[0] as Store 
    });
  },
}));

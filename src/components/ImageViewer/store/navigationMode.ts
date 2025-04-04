import { LocalStorageKey } from '@/constants/storage'
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export type NavigationMode = 'scroll' | 'touch'

type Store = {
  navMode: NavigationMode
  setNavMode: (mode: NavigationMode) => void
}

export const useNavigationModeStore = create<Store>()(
  persist(
    (set) => ({
      navMode: 'touch',
      setNavMode: (navMode: NavigationMode) => set({ navMode }),
    }),
    { name: LocalStorageKey.CONTROLLER_NAVIGATION_MODE },
  ),
)

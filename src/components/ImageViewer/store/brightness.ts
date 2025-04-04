import { SessionStorageKey } from '@/constants/storage'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'

type Store = {
  brightness: number
  getBrightness: () => number
  setBrightness: (brightness: number) => void
}

export const useBrightnessStore = create<Store>()(
  persist(
    (set, get) => ({
      brightness: 100,
      getBrightness: () => get().brightness,
      setBrightness: (brightness: number) => set({ brightness: Math.min(Math.max(10, brightness), 100) }),
    }),
    {
      name: SessionStorageKey.CONTROLLER_BRIGHTNESS,
      storage: createJSONStorage(() => sessionStorage),
    },
  ),
)

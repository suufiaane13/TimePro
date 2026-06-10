import type { StateStorage } from 'zustand/middleware'
import { toast } from 'sonner'
import i18n from '@/utils/i18n'

/** localStorage avec gestion quota / accès refusé */
export const safeStorage: StateStorage = {
  getItem: (name) => {
    try {
      return localStorage.getItem(name)
    } catch {
      return null
    }
  },
  setItem: (name, value) => {
    try {
      localStorage.setItem(name, value)
    } catch (error) {
      if (error instanceof DOMException && error.name === 'QuotaExceededError') {
        toast.error(i18n.t('common.storageFull'))
      } else {
        toast.error(i18n.t('common.storageError'))
      }
    }
  },
  removeItem: (name) => {
    try {
      localStorage.removeItem(name)
    } catch {
      /* ignore */
    }
  },
}

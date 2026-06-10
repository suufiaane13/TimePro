import { format } from 'date-fns'
import { create } from 'zustand'
import { createJSONStorage, persist } from 'zustand/middleware'
import type { AppState, JourSaisie, LangueUI, Profil, ThemeMode } from '@/types'
import { estDimancheBloque } from '@/utils/calcHeures'
import { safeStorage } from '@/utils/safeStorage'
import { applyTheme } from '@/utils/theme'
import i18n from '@/utils/i18n'
import { toast } from 'sonner'

const defaultProfil: Profil = {
  nom: 'EL-ALAOUI',
  prenom: 'Hamza',
  pays: 'Italia',
  horaireRef: {
    debutMatin: '08:00',
    finMatin: '12:00',
    debutPm: '13:00',
    finPm: '17:00',
  },
}

interface PresencesStore extends AppState {
  setLangue: (langue: LangueUI) => void
  setTheme: (theme: ThemeMode) => void
  setMoisActif: (mois: string) => void
  setDateSaisie: (date: string) => void
  setProfil: (profil: Partial<Profil>) => void
  setDimancheActif: (actif: boolean) => void
  getJour: (date: string) => JourSaisie
  saveJour: (jour: JourSaisie) => void
  clearJour: (date: string) => void
}

function emptyJour(date: string): JourSaisie {
  return {
    date,
    entreeMatin: null,
    sortieMatin: null,
    entreePm: null,
    sortiePm: null,
  }
}

export const usePresences = create<PresencesStore>()(
  persist(
    (set, get) => ({
      profil: defaultProfil,
      langue: 'it',
      langueChoisie: false,
      theme: 'system',
      moisActif: format(new Date(), 'yyyy-MM'),
      dateSaisie: format(new Date(), 'yyyy-MM-dd'),
      mois: {},
      dimancheActif: false,

      setLangue: (langue) => {
        document.documentElement.dir = langue === 'ar' ? 'rtl' : 'ltr'
        document.documentElement.lang = langue
        void i18n.changeLanguage(langue)
        set({ langue, langueChoisie: true })
      },

      setTheme: (theme) => {
        applyTheme(theme)
        set({ theme })
      },

      setMoisActif: (mois) => set({ moisActif: mois }),
      setDateSaisie: (date) => set({ dateSaisie: date }),
      setDimancheActif: (dimancheActif) => set({ dimancheActif }),

      setProfil: (updates) =>
        set((state) => ({
          profil: { ...state.profil, ...updates },
        })),

      getJour: (date) => {
        const mois = date.slice(0, 7)
        const moisData = get().mois[mois]
        return moisData?.jours[date] ?? emptyJour(date)
      },

      saveJour: (jour) => {
        if (estDimancheBloque(jour.date, get().dimancheActif)) return
        const mois = jour.date.slice(0, 7)
        set((state) => {
          const existing = state.mois[mois] ?? { mois, jours: {} }
          return {
            mois: {
              ...state.mois,
              [mois]: {
                ...existing,
                jours: { ...existing.jours, [jour.date]: jour },
              },
            },
          }
        })
      },

      clearJour: (date) => {
        const mois = date.slice(0, 7)
        set((state) => {
          const existing = state.mois[mois]
          if (!existing) return state
          const jours = { ...existing.jours }
          delete jours[date]
          return {
            mois: {
              ...state.mois,
              [mois]: { ...existing, jours },
            },
          }
        })
      },
    }),
    {
      name: 'timepro-v1',
      storage: createJSONStorage(() => safeStorage),
      onRehydrateStorage: () => (state, error) => {
        if (error) {
          toast.error(i18n.t('common.storageCorrupt'))
          applyTheme('system')
          return
        }
        if (state) applyTheme(state.theme ?? 'system')
      },
      merge: (persisted, current) => {
        const p = persisted as Partial<AppState> | undefined
        const merged = { ...current, ...p }
        if (p && p.langueChoisie === undefined) {
          merged.langueChoisie = true
        }
        applyTheme(merged.theme ?? 'system')
        return merged
      },
    },
  ),
)

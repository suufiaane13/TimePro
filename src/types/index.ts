export interface HoraireRef {
  debutMatin: string
  finMatin: string
  debutPm: string
  finPm: string
}

export interface Profil {
  nom: string
  prenom: string
  pays: string
  horaireRef: HoraireRef
}

export interface JourSaisie {
  date: string
  entreeMatin: string | null
  sortieMatin: string | null
  entreePm: string | null
  sortiePm: string | null
}

export interface JourCalcule extends JourSaisie {
  heuresTravaillees: number
  heuresNormales: number
  heuresExtra: number
  estSamedi: boolean
  estDimanche: boolean
  invalide: boolean
}

export interface MoisData {
  mois: string
  jours: Record<string, JourSaisie>
}

export type LangueUI = 'it' | 'ar'

export type ThemeMode = 'light' | 'dark' | 'system'

export interface AppState {
  profil: Profil
  langue: LangueUI
  langueChoisie: boolean
  theme: ThemeMode
  moisActif: string
  mois: Record<string, MoisData>
  dimancheActif: boolean
  dateSaisie: string
}

import { getDay, parseISO } from 'date-fns'
import type { HoraireRef, JourCalcule, JourSaisie } from '@/types'

function parseMinutes(time: string): number {
  const [h, m] = time.split(':').map(Number)
  return h * 60 + m
}

function dureeCreneau(entree: string | null, sortie: string | null): number | null {
  if (!entree || !sortie) return 0
  const start = parseMinutes(entree)
  const end = parseMinutes(sortie)
  if (end <= start) return null
  return (end - start) / 60
}

export function heuresNormalesRef(horaireRef: HoraireRef): number {
  const matin =
    (parseMinutes(horaireRef.finMatin) - parseMinutes(horaireRef.debutMatin)) / 60
  const pm = (parseMinutes(horaireRef.finPm) - parseMinutes(horaireRef.debutPm)) / 60
  return matin + pm
}

/** Dimanche non activé dans les paramètres → saisie et stats ignorées */
export function estDimancheBloque(date: string, dimancheActif: boolean): boolean {
  return getDay(parseISO(date)) === 0 && !dimancheActif
}

export function calculerJour(
  jour: JourSaisie,
  horaireRef: HoraireRef,
  dimancheActif: boolean,
): JourCalcule {
  const date = parseISO(jour.date)
  const day = getDay(date)
  const estSamedi = day === 6
  const estDimanche = day === 0

  const dureeMatin = dureeCreneau(jour.entreeMatin, jour.sortieMatin)
  const dureePm = dureeCreneau(jour.entreePm, jour.sortiePm)

  const matinInvalide = dureeMatin === null
  const pmInvalide = dureePm === null
  const invalide = matinInvalide || pmInvalide

  const heuresTravaillees =
    (matinInvalide ? 0 : (dureeMatin ?? 0)) + (pmInvalide ? 0 : (dureePm ?? 0))

  const jourVide =
    !jour.entreeMatin &&
    !jour.sortieMatin &&
    !jour.entreePm &&
    !jour.sortiePm

  const ref = heuresNormalesRef(horaireRef)
  let heuresNormales = 0

  if (!jourVide && heuresTravaillees > 0) {
    if (estSamedi || (estDimanche && dimancheActif)) {
      heuresNormales = 0
    } else if (!estDimanche) {
      heuresNormales = Math.min(heuresTravaillees, ref)
    }
  }

  return {
    ...jour,
    heuresTravaillees,
    heuresNormales,
    heuresExtra: jourVide || heuresTravaillees <= 0 ? 0 : heuresTravaillees - heuresNormales,
    estSamedi,
    estDimanche,
    invalide,
  }
}

/** Affiche une durée → "08h 30min", "01h", "45min" (jamais de décimal) */
export function formatDuree(heures: number, langue: 'it' | 'ar' = 'it'): string {
  const totalMinutes = Math.round(heures * 60)
  if (totalMinutes <= 0) return '-'

  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60
  const hUnit = langue === 'ar' ? 'س' : 'h'
  const mUnit = langue === 'ar' ? 'د' : 'min'
  const hh = String(h).padStart(2, '0')
  const mm = String(m).padStart(2, '0')

  if (h === 0) return `${mm}${mUnit}`
  if (m === 0) return `${hh}${hUnit}`
  return `${hh}${hUnit} ${mm}${mUnit}`
}

/** @deprecated Utiliser formatDuree */
export const formatHeures = formatDuree

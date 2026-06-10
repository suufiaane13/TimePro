import { eachDayOfInterval, endOfMonth, format, parseISO, startOfMonth } from 'date-fns'
import type { MoisData, Profil } from '@/types'
import { calculerJour, estDimancheBloque } from '@/utils/calcHeures'

export interface StatsMois {
  travaillees: number
  normales: number
  extra: number
  joursTravailles: number
  samedis: number
  joursAvecExtra: number
}

export interface SemaineStats {
  semaine: string
  normales: number
  extra: number
}

function jourRempli(saisie: {
  entreeMatin: string | null
  sortieMatin: string | null
  entreePm: string | null
  sortiePm: string | null
}): boolean {
  return Boolean(
    saisie.entreeMatin || saisie.sortieMatin || saisie.entreePm || saisie.sortiePm,
  )
}

export function computeStatsMois(
  moisActif: string,
  moisData: MoisData | undefined,
  profil: Profil,
  dimancheActif: boolean,
): StatsMois {
  const monthDate = parseISO(`${moisActif}-01`)
  const days = eachDayOfInterval({
    start: startOfMonth(monthDate),
    end: endOfMonth(monthDate),
  })
  const jours = moisData?.jours ?? {}

  let travaillees = 0
  let normales = 0
  let extra = 0
  let joursTravailles = 0
  let samedis = 0
  let joursAvecExtra = 0

  for (const day of days) {
    const key = format(day, 'yyyy-MM-dd')
    const saisie = jours[key]
    if (!saisie || !jourRempli(saisie)) continue
    if (estDimancheBloque(key, dimancheActif)) continue
    const calc = calculerJour(saisie, profil.horaireRef, dimancheActif)
    if (calc.heuresTravaillees <= 0) continue

    joursTravailles++
    if (calc.estSamedi) samedis++
    if (calc.heuresExtra > 0) joursAvecExtra++
    travaillees += calc.heuresTravaillees
    normales += calc.heuresNormales
    extra += calc.heuresExtra
  }

  return { travaillees, normales, extra, joursTravailles, samedis, joursAvecExtra }
}

export function computeSemaines(
  moisActif: string,
  moisData: MoisData | undefined,
  profil: Profil,
  dimancheActif: boolean,
): SemaineStats[] {
  const monthDate = parseISO(`${moisActif}-01`)
  const days = eachDayOfInterval({
    start: startOfMonth(monthDate),
    end: endOfMonth(monthDate),
  })
  const jours = moisData?.jours ?? {}
  const buckets = new Map<number, SemaineStats>()

  for (const day of days) {
    const key = format(day, 'yyyy-MM-dd')
    const saisie = jours[key]
    if (!saisie || !jourRempli(saisie)) continue
    if (estDimancheBloque(key, dimancheActif)) continue
    const calc = calculerJour(saisie, profil.horaireRef, dimancheActif)
    if (calc.heuresTravaillees <= 0) continue

    const weekIdx = Math.floor((day.getDate() - 1) / 7)
    const existing = buckets.get(weekIdx) ?? {
      semaine: `S${weekIdx + 1}`,
      normales: 0,
      extra: 0,
    }
    existing.normales += calc.heuresNormales
    existing.extra += calc.heuresExtra
    buckets.set(weekIdx, existing)
  }

  return Array.from(buckets.entries())
    .sort(([a], [b]) => a - b)
    .map(([, v]) => v)
}

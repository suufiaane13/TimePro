import {
  eachDayOfInterval,
  endOfMonth,
  format,
  parseISO,
  startOfMonth,
} from 'date-fns'
import { it } from 'date-fns/locale'
import type { JourSaisie, MoisData, Profil } from '@/types'
import { calculerJour, estDimancheBloque } from '@/utils/calcHeures'

export interface ExportRow {
  data: string
  giorno: string
  entreeMatin: string
  sortieMatin: string
  entreePm: string
  sortiePm: string
  oreLavorate: number
  oreNormali: number
  oreStraordinarie: number
  estSamedi: boolean
}

export interface ExportPayload {
  rows: ExportRow[]
  totaux: { lavorate: number; normali: number; straordinarie: number }
  periode: string
  filenameBase: string
}

function jourRempli(jour: JourSaisie): boolean {
  return Boolean(
    jour.entreeMatin || jour.sortieMatin || jour.entreePm || jour.sortiePm,
  )
}

export function buildExportPayload(
  moisActif: string,
  moisData: MoisData | undefined,
  profil: Profil,
  dimancheActif: boolean,
): ExportPayload {
  const monthDate = parseISO(`${moisActif}-01`)
  const days = eachDayOfInterval({
    start: startOfMonth(monthDate),
    end: endOfMonth(monthDate),
  })
  const jours = moisData?.jours ?? {}
  const rows: ExportRow[] = []

  let lavorate = 0
  let normali = 0
  let straordinarie = 0

  for (const day of days) {
    const key = format(day, 'yyyy-MM-dd')
    const saisie = jours[key]
    if (!saisie || !jourRempli(saisie)) continue
    if (estDimancheBloque(key, dimancheActif)) continue

    const calc = calculerJour(saisie, profil.horaireRef, dimancheActif)
    if (calc.heuresTravaillees <= 0) continue

    rows.push({
      data: format(day, 'dd/MM/yyyy'),
      giorno: format(day, 'EEEE', { locale: it }),
      entreeMatin: formatHeureCell(saisie.entreeMatin),
      sortieMatin: formatHeureCell(saisie.sortieMatin),
      entreePm: formatHeureCell(saisie.entreePm),
      sortiePm: formatHeureCell(saisie.sortiePm),
      oreLavorate: calc.heuresTravaillees,
      oreNormali: calc.heuresNormales,
      oreStraordinarie: calc.heuresExtra,
      estSamedi: calc.estSamedi,
    })

    lavorate += calc.heuresTravaillees
    normali += calc.heuresNormales
    straordinarie += calc.heuresExtra
  }

  const debut = format(startOfMonth(monthDate), 'dd/MM/yyyy')
  const fin = format(endOfMonth(monthDate), 'dd/MM/yyyy')
  const mmYyyy = format(monthDate, 'MMyyyy')

  return {
    rows,
    totaux: { lavorate, normali, straordinarie },
    periode: `${debut} - ${fin}`,
    filenameBase: `presenze_${profil.nom}_${profil.prenom}_${mmYyyy}`,
  }
}

export const EXPORT_VIDE = '-'

/** Heure de saisie vide → "-" */
export function formatHeureCell(value: string | null | undefined): string {
  return value?.trim() ? value : EXPORT_VIDE
}

/** Format export Excel — "08h 30min" ; "-" si 0 (pas de 00h / 00min) */
export function formatOreExport(heures: number): string {
  const totalMinutes = Math.round(heures * 60)
  if (totalMinutes <= 0) return EXPORT_VIDE

  const h = Math.floor(totalMinutes / 60)
  const m = totalMinutes % 60

  if (h === 0 && m === 0) return EXPORT_VIDE
  if (h === 0) return `${String(m).padStart(2, '0')}min`
  if (m === 0) return `${String(h).padStart(2, '0')}h`
  return `${String(h).padStart(2, '0')}h ${String(m).padStart(2, '0')}min`
}

export function downloadBlob(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob)
  const anchor = document.createElement('a')
  anchor.href = url
  anchor.download = filename
  anchor.click()
  URL.revokeObjectURL(url)
}

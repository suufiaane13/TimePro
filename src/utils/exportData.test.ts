import { describe, expect, it } from 'vitest'
import { buildExportPayload, formatHeureCell, formatOreExport } from '@/utils/exportData'
import type { MoisData, Profil } from '@/types'

const profil: Profil = {
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

describe('formatHeureCell', () => {
  it('affiche un tiret si vide', () => {
    expect(formatHeureCell(null)).toBe('-')
    expect(formatHeureCell('')).toBe('-')
    expect(formatHeureCell('08:00')).toBe('08:00')
  })
})

describe('formatOreExport', () => {
  it('utilise le format heures/minutes italien', () => {
    expect(formatOreExport(8.5)).toBe('08h 30min')
    expect(formatOreExport(222.5)).toBe('222h 30min')
    expect(formatOreExport(1)).toBe('01h')
  })

  it('affiche un tiret si 0h ou 0min', () => {
    expect(formatOreExport(0)).toBe('-')
  })
})

describe('buildExportPayload', () => {
  it('génère les lignes et totaux du mois', () => {
    const moisData: MoisData = {
      mois: '2026-05',
      jours: {
        '2026-05-04': {
          date: '2026-05-04',
          entreeMatin: '08:00',
          sortieMatin: '12:00',
          entreePm: '13:00',
          sortiePm: '17:00',
        },
        '2026-05-02': {
          date: '2026-05-02',
          entreeMatin: '08:00',
          sortieMatin: '12:00',
          entreePm: null,
          sortiePm: null,
        },
      },
    }

    const payload = buildExportPayload('2026-05', moisData, profil, false)
    expect(payload.rows).toHaveLength(2)
    expect(payload.totaux.lavorate).toBe(12)
    expect(payload.totaux.normali).toBe(8)
    expect(payload.totaux.straordinarie).toBe(4)
    expect(payload.filenameBase).toBe('presenze_EL-ALAOUI_Hamza_052026')
    expect(payload.rows[0].giorno).toMatch(/lunedì|martedì|mercoledì|giovedì|venerdì|sabato|domenica/i)
  })

  it('ignore les jours vides', () => {
    const payload = buildExportPayload('2026-05', { mois: '2026-05', jours: {} }, profil, false)
    expect(payload.rows).toHaveLength(0)
  })
})

import { describe, expect, it } from 'vitest'
import { calculerJour, estDimancheBloque, formatDuree, heuresNormalesRef } from '@/utils/calcHeures'
import type { HoraireRef } from '@/types'

const horaireRef: HoraireRef = {
  debutMatin: '08:00',
  finMatin: '12:00',
  debutPm: '13:00',
  finPm: '17:00',
}

describe('heuresNormalesRef', () => {
  it('calcule 8h pour horaire standard', () => {
    expect(heuresNormalesRef(horaireRef)).toBe(8)
  })
})

describe('calculerJour', () => {
  it('jour ouvré 8h sans extra', () => {
    const r = calculerJour(
      {
        date: '2026-05-04',
        entreeMatin: '08:00',
        sortieMatin: '12:00',
        entreePm: '13:00',
        sortiePm: '17:00',
      },
      horaireRef,
      false,
    )
    expect(r.heuresTravaillees).toBe(8)
    expect(r.heuresNormales).toBe(8)
    expect(r.heuresExtra).toBe(0)
    expect(r.invalide).toBe(false)
  })

  it('jour avec 3h extra', () => {
    const r = calculerJour(
      {
        date: '2026-05-04',
        entreeMatin: '07:00',
        sortieMatin: '12:30',
        entreePm: '13:00',
        sortiePm: '18:30',
      },
      horaireRef,
      false,
    )
    expect(r.heuresTravaillees).toBe(11)
    expect(r.heuresNormales).toBe(8)
    expect(r.heuresExtra).toBe(3)
  })

  it('samedi: 0h normales, tout en extra', () => {
    const r = calculerJour(
      {
        date: '2026-05-02',
        entreeMatin: '08:00',
        sortieMatin: '12:00',
        entreePm: null,
        sortiePm: null,
      },
      horaireRef,
      false,
    )
    expect(r.estSamedi).toBe(true)
    expect(r.heuresNormales).toBe(0)
    expect(r.heuresExtra).toBe(4)
  })

  it('créneau invalide', () => {
    const r = calculerJour(
      {
        date: '2026-05-04',
        entreeMatin: '12:00',
        sortieMatin: '08:00',
        entreePm: null,
        sortiePm: null,
      },
      horaireRef,
      false,
    )
    expect(r.invalide).toBe(true)
    expect(r.heuresTravaillees).toBe(0)
  })

  it('compte le PM si le matin est invalide', () => {
    const r = calculerJour(
      {
        date: '2026-05-04',
        entreeMatin: '12:00',
        sortieMatin: '08:00',
        entreePm: '13:00',
        sortiePm: '17:00',
      },
      horaireRef,
      false,
    )
    expect(r.invalide).toBe(true)
    expect(r.heuresTravaillees).toBe(4)
    expect(r.heuresNormales).toBe(4)
    expect(r.heuresExtra).toBe(0)
  })
})

describe('estDimancheBloque', () => {
  it('bloque le dimanche si option désactivée', () => {
    expect(estDimancheBloque('2026-05-03', false)).toBe(true)
    expect(estDimancheBloque('2026-05-03', true)).toBe(false)
    expect(estDimancheBloque('2026-05-04', false)).toBe(false)
  })
})

describe('formatDuree', () => {
  it('affiche heures pleines avec zéro devant', () => {
    expect(formatDuree(8)).toBe('08h')
    expect(formatDuree(1)).toBe('01h')
  })

  it('affiche heures et minutes paddées', () => {
    expect(formatDuree(8.5)).toBe('08h 30min')
    expect(formatDuree(1.5)).toBe('01h 30min')
  })

  it('affiche minutes seules paddées', () => {
    expect(formatDuree(0.75)).toBe('45min')
  })

  it('affiche un tiret si 0h', () => {
    expect(formatDuree(0)).toBe('-')
  })
})

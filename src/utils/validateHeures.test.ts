import { describe, expect, it } from 'vitest'
import { creneauInvalide, horaireRefInvalide } from '@/utils/validateHeures'

describe('creneauInvalide', () => {
  it('retourne false si un champ est vide', () => {
    expect(creneauInvalide('08:00', null)).toBe(false)
    expect(creneauInvalide(null, '12:00')).toBe(false)
  })

  it('retourne true si sortie <= entree', () => {
    expect(creneauInvalide('08:00', '08:00')).toBe(true)
    expect(creneauInvalide('12:00', '08:00')).toBe(true)
  })

  it('retourne false si sortie > entree', () => {
    expect(creneauInvalide('08:00', '12:00')).toBe(false)
  })
})

describe('horaireRefInvalide', () => {
  it('valide un horaire standard', () => {
    expect(
      horaireRefInvalide({
        debutMatin: '08:00',
        finMatin: '12:00',
        debutPm: '13:00',
        finPm: '17:00',
      }),
    ).toBe(false)
  })

  it('détecte un créneau incohérent', () => {
    expect(
      horaireRefInvalide({
        debutMatin: '08:00',
        finMatin: '12:00',
        debutPm: '17:00',
        finPm: '13:00',
      }),
    ).toBe(true)
  })
})

export function creneauInvalide(entree: string | null, sortie: string | null): boolean {
  if (!entree || !sortie) return false
  const [eh, em] = entree.split(':').map(Number)
  const [sh, sm] = sortie.split(':').map(Number)
  return sh * 60 + sm <= eh * 60 + em
}

export function horaireRefInvalide(horaire: {
  debutMatin: string
  finMatin: string
  debutPm: string
  finPm: string
}): boolean {
  return (
    creneauInvalide(horaire.debutMatin, horaire.finMatin) ||
    creneauInvalide(horaire.debutPm, horaire.finPm)
  )
}

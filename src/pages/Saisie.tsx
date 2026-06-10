import { format, isToday, parseISO } from 'date-fns'
import { ar, it } from 'date-fns/locale'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { usePresences } from '@/store/usePresences'
import type { JourSaisie } from '@/types'
import { calculerJour, estDimancheBloque, formatDuree } from '@/utils/calcHeures'
import { creneauInvalide } from '@/utils/validateHeures'

function TimeField({
  id,
  label,
  value,
  onChange,
  error,
  disabled,
}: {
  id: string
  label: string
  value: string | null
  onChange: (v: string) => void
  error?: boolean
  disabled?: boolean
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        type="time"
        value={value ?? ''}
        onChange={(e) => onChange(e.target.value)}
        className="h-12 text-base"
        aria-invalid={error}
        disabled={disabled}
      />
    </div>
  )
}

function prochaineDateSaisissable(from: string, delta: number, dimancheActif: boolean): string {
  const d = parseISO(from)
  for (let i = 0; i < 366; i++) {
    d.setDate(d.getDate() + delta)
    const next = format(d, 'yyyy-MM-dd')
    if (!estDimancheBloque(next, dimancheActif)) return next
  }
  return from
}

function DateNav({
  dateLabel,
  title,
  langue,
  showTodayButton,
  onPrev,
  onNext,
  onToday,
  todayLabel,
  prevLabel,
  nextLabel,
}: {
  dateLabel: string
  title: string
  langue: 'it' | 'ar'
  showTodayButton: boolean
  onPrev: () => void
  onNext: () => void
  onToday: () => void
  todayLabel: string
  prevLabel: string
  nextLabel: string
}) {
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Button variant="outline" size="icon" onClick={onPrev} aria-label={prevLabel}>
          <ChevronLeft className={langue === 'ar' ? 'rotate-180' : ''} />
        </Button>
        <div className="text-center">
          <h1 className="text-lg font-semibold capitalize">{title}</h1>
          <p className="text-sm text-muted-foreground capitalize">{dateLabel}</p>
        </div>
        <Button variant="outline" size="icon" onClick={onNext} aria-label={nextLabel}>
          <ChevronRight className={langue === 'ar' ? 'rotate-180' : ''} />
        </Button>
      </div>
      {showTodayButton && (
        <Button variant="outline" size="sm" className="w-full gap-2" onClick={onToday}>
          <CalendarDays className="size-4" />
          {todayLabel}
        </Button>
      )}
    </div>
  )
}

function SaisieEditor({ dateSaisie }: { dateSaisie: string }) {
  const { t } = useTranslation()
  const langue = usePresences((s) => s.langue)
  const profil = usePresences((s) => s.profil)
  const dimancheActif = usePresences((s) => s.dimancheActif)
  const getJour = usePresences((s) => s.getJour)
  const saveJour = usePresences((s) => s.saveJour)
  const clearJour = usePresences((s) => s.clearJour)

  const [jour, setJour] = useState<JourSaisie>(() => getJour(dateSaisie))

  const calcule = useMemo(
    () => calculerJour(jour, profil.horaireRef, dimancheActif),
    [jour, profil.horaireRef, dimancheActif],
  )

  const erreurMatin = creneauInvalide(jour.entreeMatin, jour.sortieMatin)
  const erreurPm = creneauInvalide(jour.entreePm, jour.sortiePm)

  const update = (patch: Partial<JourSaisie>) => setJour((prev) => ({ ...prev, ...patch }))

  const handleSave = () => {
    if (erreurMatin || erreurPm) {
      toast.error(t('saisie.erreurCreneau'))
      return
    }
    saveJour({ ...jour, date: dateSaisie })
    if (navigator.vibrate) navigator.vibrate(10)
    toast.success(t('common.sauvegarde'))
  }

  const handleClear = () => {
    clearJour(dateSaisie)
    setJour({
      date: dateSaisie,
      entreeMatin: null,
      sortieMatin: null,
      entreePm: null,
      sortiePm: null,
    })
    toast.success(t('common.sauvegarde'))
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>{t('saisie.matin')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <TimeField
            id="entree-matin"
            label={t('saisie.entree')}
            value={jour.entreeMatin}
            onChange={(v) => update({ entreeMatin: v || null })}
            error={erreurMatin}
          />
          <TimeField
            id="sortie-matin"
            label={t('saisie.sortie')}
            value={jour.sortieMatin}
            onChange={(v) => update({ sortieMatin: v || null })}
            error={erreurMatin}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>{t('saisie.pm')}</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 gap-4">
          <TimeField
            id="entree-pm"
            label={t('saisie.entree')}
            value={jour.entreePm}
            onChange={(v) => update({ entreePm: v || null })}
            error={erreurPm}
          />
          <TimeField
            id="sortie-pm"
            label={t('saisie.sortie')}
            value={jour.sortiePm}
            onChange={(v) => update({ sortiePm: v || null })}
            error={erreurPm}
          />
        </CardContent>
      </Card>

      {(erreurMatin || erreurPm) && (
        <p className="text-sm text-destructive">{t('saisie.erreurCreneau')}</p>
      )}

      <Card>
        <CardContent className="grid grid-cols-3 gap-3 pt-6 text-center">
          <div>
            <Badge variant="secondary" className="mb-2">
              {t('saisie.travaillees')}
            </Badge>
            <p className="text-xl font-semibold">{formatDuree(calcule.heuresTravaillees, langue)}</p>
          </div>
          <div>
            <Badge className="mb-2 bg-[var(--success)] text-[var(--success-foreground)]">
              {t('saisie.normales')}
            </Badge>
            <p className="text-xl font-semibold">{formatDuree(calcule.heuresNormales, langue)}</p>
          </div>
          <div>
            <Badge className="mb-2 bg-[var(--warning)] text-[var(--warning-foreground)]">
              {t('saisie.extra')}
            </Badge>
            <p className="text-xl font-semibold">{formatDuree(calcule.heuresExtra, langue)}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-2 gap-3">
        <Button variant="outline" size="lg" onClick={handleClear}>
          {t('saisie.effacer')}
        </Button>
        <Button size="lg" onClick={handleSave}>
          {t('saisie.sauvegarder')}
        </Button>
      </div>
    </>
  )
}

export default function SaisiePage() {
  const { t, i18n } = useTranslation()
  const langue = usePresences((s) => s.langue)
  const dimancheActif = usePresences((s) => s.dimancheActif)
  const dateSaisie = usePresences((s) => s.dateSaisie)
  const setDateSaisie = usePresences((s) => s.setDateSaisie)
  const setMoisActif = usePresences((s) => s.setMoisActif)

  const dimancheBloque = estDimancheBloque(dateSaisie, dimancheActif)
  const jourCourant = format(new Date(), 'yyyy-MM-dd')
  const isJourCourant = isToday(parseISO(dateSaisie))
  const todayAccessible = !estDimancheBloque(jourCourant, dimancheActif)

  const locale = i18n.language === 'ar' ? ar : it
  const dateLabel = format(parseISO(dateSaisie), 'EEEE d MMMM yyyy', { locale })

  const shiftDate = (delta: number) => {
    const next = prochaineDateSaisissable(dateSaisie, delta, dimancheActif)
    setDateSaisie(next)
    setMoisActif(next.slice(0, 7))
  }

  const goToToday = () => {
    setDateSaisie(jourCourant)
    setMoisActif(jourCourant.slice(0, 7))
  }

  const dateNavProps = {
    dateLabel,
    title: t('saisie.title'),
    langue,
    showTodayButton: !isJourCourant && todayAccessible,
    onPrev: () => shiftDate(-1),
    onNext: () => shiftDate(1),
    onToday: goToToday,
    todayLabel: t('saisie.jourCourant'),
    prevLabel: t('saisie.jourPrecedent'),
    nextLabel: t('saisie.jourSuivant'),
  }

  if (dimancheBloque) {
    return (
      <div className="space-y-4">
        <DateNav {...dateNavProps} />

        <Card className="border-dashed">
          <CardContent className="py-8 text-center">
            <p className="text-sm font-medium">{t('saisie.dimancheDesactive')}</p>
            <p className="mt-2 text-xs text-muted-foreground">{t('saisie.dimancheDesactiveHint')}</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <DateNav {...dateNavProps} />
      <SaisieEditor key={dateSaisie} dateSaisie={dateSaisie} />
    </div>
  )
}

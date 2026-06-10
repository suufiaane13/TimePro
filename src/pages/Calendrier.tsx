import {
  eachDayOfInterval,
  endOfMonth,
  format,
  getDay,
  isToday,
  parseISO,
  startOfMonth,
} from 'date-fns'
import { ar, it } from 'date-fns/locale'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { MonthNavigator } from '@/components/MonthNavigator'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { usePresences } from '@/store/usePresences'
import { calculerJour, estDimancheBloque } from '@/utils/calcHeures'

export default function CalendrierPage() {
  const { t, i18n } = useTranslation()
  const navigate = useNavigate()
  const locale = i18n.language === 'ar' ? ar : it
  const moisActif = usePresences((s) => s.moisActif)
  const setDateSaisie = usePresences((s) => s.setDateSaisie)
  const mois = usePresences((s) => s.mois)
  const profil = usePresences((s) => s.profil)
  const dimancheActif = usePresences((s) => s.dimancheActif)

  const monthDate = parseISO(`${moisActif}-01`)
  const days = useMemo(() => {
    return eachDayOfInterval({
      start: startOfMonth(monthDate),
      end: endOfMonth(monthDate),
    })
  }, [monthDate])

  const weekdayLabels = useMemo(() => {
    const refMonday = parseISO('2024-01-01')
    return Array.from({ length: 7 }, (_, i) => {
      const day = new Date(refMonday)
      day.setDate(refMonday.getDate() + i)
      return format(day, 'EEEEEE', { locale })
    })
  }, [locale])

  const moisData = mois[moisActif]?.jours ?? {}
  const startPad = (getDay(startOfMonth(monthDate)) + 6) % 7

  const goToDay = (date: string) => {
    if (estDimancheBloque(date, dimancheActif)) return
    setDateSaisie(date)
    navigate('/')
  }

  return (
    <div className="space-y-4">
      <MonthNavigator />

      <Card>
        <CardHeader>
          <CardTitle>{t('calendrier.title')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-2 grid grid-cols-7 gap-1 text-center text-xs text-muted-foreground">
            {weekdayLabels.map((label, index) => (
              <span key={index}>{label}</span>
            ))}
          </div>
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: startPad }).map((_, i) => (
              <div key={`pad-${i}`} />
            ))}
            {days.map((day) => {
              const key = format(day, 'yyyy-MM-dd')
              const jour = moisData[key]
              const calc = jour
                ? calculerJour(jour, profil.horaireRef, dimancheActif)
                : null
              const hasData = Boolean(jour)
              const hasExtra = calc && calc.heuresExtra > 0
              const today = isToday(day)
              const dimancheBloque = estDimancheBloque(key, dimancheActif)

              return (
                <button
                  key={key}
                  type="button"
                  disabled={dimancheBloque}
                  aria-label={format(day, 'd MMMM yyyy', { locale })}
                  onClick={() => goToDay(key)}
                  className={cn(
                    'relative flex aspect-square flex-col items-center justify-center rounded-full text-sm font-medium transition active:scale-95',
                    dimancheBloque && 'cursor-not-allowed bg-muted/40 text-muted-foreground/60',
                    !dimancheBloque && !hasData && 'bg-muted/50 text-muted-foreground',
                    !dimancheBloque && hasData && !hasExtra && 'bg-[var(--success)]/20 text-[var(--success)]',
                    !dimancheBloque && hasExtra && 'bg-[var(--warning)]/20 text-[var(--warning)]',
                    today && !dimancheBloque && 'font-bold',
                    today && !hasData && !dimancheBloque && 'bg-primary/10 text-primary',
                  )}
                >
                  {format(day, 'd')}
                  {today && !dimancheBloque && (
                    <span
                      className="absolute bottom-1.5 size-1.5 rounded-full bg-primary"
                      aria-hidden
                    />
                  )}
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

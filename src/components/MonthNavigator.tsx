import { addMonths, format, parseISO, subMonths } from 'date-fns'
import { ar, it } from 'date-fns/locale'
import { CalendarDays, ChevronLeft, ChevronRight } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { usePresences } from '@/store/usePresences'

export function MonthNavigator() {
  const { t, i18n } = useTranslation()
  const langue = usePresences((s) => s.langue)
  const moisActif = usePresences((s) => s.moisActif)
  const setMoisActif = usePresences((s) => s.setMoisActif)

  const locale = i18n.language === 'ar' ? ar : it
  const monthDate = parseISO(`${moisActif}-01`)
  const moisCourant = format(new Date(), 'yyyy-MM')
  const isCurrentMonth = moisActif === moisCourant

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-2">
        <Button
          variant="outline"
          size="icon"
          aria-label={t('common.moisPrecedent')}
          onClick={() => setMoisActif(format(subMonths(monthDate, 1), 'yyyy-MM'))}
        >
          <ChevronLeft className={langue === 'ar' ? 'rotate-180' : ''} />
        </Button>
        <p className="text-lg font-semibold capitalize">{format(monthDate, 'MMMM yyyy', { locale })}</p>
        <Button
          variant="outline"
          size="icon"
          aria-label={t('common.moisSuivant')}
          onClick={() => setMoisActif(format(addMonths(monthDate, 1), 'yyyy-MM'))}
        >
          <ChevronRight className={langue === 'ar' ? 'rotate-180' : ''} />
        </Button>
      </div>
      {!isCurrentMonth && (
        <Button
          variant="outline"
          size="sm"
          className="w-full gap-2"
          onClick={() => setMoisActif(moisCourant)}
        >
          <CalendarDays className="size-4" />
          {t('calendrier.moisCourant')}
        </Button>
      )}
    </div>
  )
}

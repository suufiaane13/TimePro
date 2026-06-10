import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { KpiGrid } from '@/components/KpiGrid'
import { MiniChart } from '@/components/MiniChart'
import { MonthNavigator } from '@/components/MonthNavigator'
import { PageHeader } from '@/components/PageHeader'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { usePresences } from '@/store/usePresences'
import { formatDuree } from '@/utils/calcHeures'
import { computeSemaines, computeStatsMois } from '@/utils/statsMois'

export default function DashboardPage() {
  const { t, i18n } = useTranslation()
  const langue = i18n.language === 'ar' ? 'ar' : 'it'
  const moisActif = usePresences((s) => s.moisActif)
  const mois = usePresences((s) => s.mois)
  const profil = usePresences((s) => s.profil)
  const dimancheActif = usePresences((s) => s.dimancheActif)

  const stats = useMemo(
    () => computeStatsMois(moisActif, mois[moisActif], profil, dimancheActif),
    [moisActif, mois, profil, dimancheActif],
  )

  const semaines = useMemo(
    () => computeSemaines(moisActif, mois[moisActif], profil, dimancheActif),
    [moisActif, mois, profil, dimancheActif],
  )

  const heuresKpis = [
    {
      label: t('dashboard.travaillees'),
      value: formatDuree(stats.travaillees, langue),
      accent: 'text-foreground',
    },
    {
      label: t('dashboard.normales'),
      value: formatDuree(stats.normales, langue),
      accent: 'text-[var(--success)]',
    },
    {
      label: t('dashboard.extra'),
      value: formatDuree(stats.extra, langue),
      accent: 'text-[var(--warning)]',
    },
  ]

  const joursKpis = [
    {
      label: t('dashboard.joursTravailles'),
      value: String(stats.joursTravailles),
    },
    {
      label: t('dashboard.samedis'),
      value: String(stats.samedis),
    },
    {
      label: t('dashboard.joursExtra'),
      value: String(stats.joursAvecExtra),
    },
  ]

  return (
    <div className="space-y-5">
      <PageHeader title={t('dashboard.title')} />
      <MonthNavigator />

      <section aria-label={t('dashboard.title')} className="space-y-3">
        <KpiGrid items={heuresKpis} />
        <KpiGrid items={joursKpis} />
      </section>

      <section aria-label={t('dashboard.graphique')}>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-base font-semibold">{t('dashboard.graphique')}</CardTitle>
            <div className="flex flex-wrap gap-4 pt-1 text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-[var(--success)]" />
                {t('dashboard.normales')}
              </span>
              <span className="inline-flex items-center gap-1.5">
                <span className="size-2.5 rounded-sm bg-[var(--warning)]" />
                {t('dashboard.extra')}
              </span>
            </div>
          </CardHeader>
          <CardContent className="pb-4">
            <MiniChart
              data={semaines}
              langue={langue}
              emptyLabel={t('common.sansDonnees')}
              labels={{
                normales: t('dashboard.normales'),
                extra: t('dashboard.extra'),
              }}
            />
          </CardContent>
        </Card>
      </section>
    </div>
  )
}

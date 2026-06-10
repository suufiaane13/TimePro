import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { toast } from 'sonner'
import { AppLogo } from '@/components/AppLogo'
import { KpiGrid } from '@/components/KpiGrid'
import { MonthNavigator } from '@/components/MonthNavigator'
import { PageHeader } from '@/components/PageHeader'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { usePresences } from '@/store/usePresences'
import { formatDuree } from '@/utils/calcHeures'
import { buildExportPayload, downloadBlob } from '@/utils/exportData'

export default function ExportPage() {
  const { t, i18n } = useTranslation()
  const langue = i18n.language === 'ar' ? 'ar' : 'it'
  const [loading, setLoading] = useState(false)

  const moisActif = usePresences((s) => s.moisActif)
  const mois = usePresences((s) => s.mois)
  const profil = usePresences((s) => s.profil)
  const dimancheActif = usePresences((s) => s.dimancheActif)

  const payload = useMemo(
    () => buildExportPayload(moisActif, mois[moisActif], profil, dimancheActif),
    [moisActif, mois, profil, dimancheActif],
  )

  const heuresKpis = [
    {
      label: t('dashboard.travaillees'),
      value: formatDuree(payload.totaux.lavorate, langue),
      accent: 'text-foreground',
    },
    {
      label: t('dashboard.normales'),
      value: formatDuree(payload.totaux.normali, langue),
      accent: 'text-[var(--success)]',
    },
    {
      label: t('dashboard.extra'),
      value: formatDuree(payload.totaux.straordinarie, langue),
      accent: 'text-[var(--warning)]',
    },
  ]

  const handleExport = async () => {
    if (payload.rows.length === 0) {
      toast.error(t('export.vide'))
      return
    }

    try {
      setLoading(true)
      const { buildExcel } = await import('@/utils/excelBuilder')
      const blob = await buildExcel(payload, profil)
      downloadBlob(blob, `${payload.filenameBase}.xlsx`)
      toast.success(t('export.succes'))
    } catch {
      toast.error(t('export.erreur'))
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-5">
      <PageHeader title={t('export.title')} />
      <MonthNavigator />

      <section aria-label={t('export.title')}>
        <KpiGrid items={heuresKpis} />
      </section>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-base font-semibold">
            <AppLogo size="xs" />
            {t('export.xlsx')}
          </CardTitle>
          <CardDescription>{t('export.xlsxDesc')}</CardDescription>
        </CardHeader>
        <CardContent>
          <Button
            className="w-full"
            size="lg"
            disabled={loading}
            onClick={() => void handleExport()}
          >
            {loading ? t('common.loading') : t('export.xlsx')}
          </Button>
        </CardContent>
      </Card>

      <p className="text-center text-xs text-muted-foreground">
        {payload.rows.length} {t('export.lignes')}
      </p>
    </div>
  )
}

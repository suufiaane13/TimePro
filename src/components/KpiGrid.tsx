import { KpiCard } from '@/components/KpiCard'
import { cn } from '@/lib/utils'

export interface KpiItem {
  label: string
  value: string
  accent?: string
}

/** Grille KPI — 2 cols mobile, 3 cols desktop ; dernière carte centrée si impaire */
export function KpiGrid({
  items,
  className,
}: {
  items: KpiItem[]
  className?: string
}) {
  const centerLastOnMobile = items.length % 2 === 1

  return (
    <div className={cn('grid grid-cols-2 gap-3 sm:grid-cols-3', className)}>
      {items.map((kpi, index) => (
        <div
          key={kpi.label}
          className={cn(
            centerLastOnMobile &&
              index === items.length - 1 &&
              'col-span-2 mx-auto w-full max-w-[calc(50%-0.375rem)] sm:col-span-1 sm:mx-0 sm:max-w-none',
          )}
        >
          <KpiCard label={kpi.label} value={kpi.value} accent={kpi.accent} />
        </div>
      ))}
    </div>
  )
}

/** Paire de KPIs centrée — même largeur que 2 colonnes de la grille principale */
export function KpiGridPair({
  items,
  className,
}: {
  items: KpiItem[]
  className?: string
}) {
  return (
    <div
      className={cn('mx-auto grid w-full grid-cols-2 gap-3 sm:max-w-md', className)}
    >
      {items.map((kpi) => (
        <KpiCard key={kpi.label} label={kpi.label} value={kpi.value} accent={kpi.accent} />
      ))}
    </div>
  )
}

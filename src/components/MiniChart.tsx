import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts'
import type { SemaineStats } from '@/utils/statsMois'
import { formatDuree } from '@/utils/calcHeures'

interface MiniChartProps {
  data: SemaineStats[]
  langue: 'it' | 'ar'
  emptyLabel: string
  labels: { normales: string; extra: string }
}

export function MiniChart({ data, langue, emptyLabel, labels }: MiniChartProps) {
  if (data.length === 0) {
    return (
      <div className="flex h-[200px] items-center justify-center text-sm text-muted-foreground">
        {emptyLabel}
      </div>
    )
  }

  return (
    <ResponsiveContainer width="100%" height={200}>
      <BarChart data={data} margin={{ top: 8, right: 4, left: -12, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
        <XAxis dataKey="semaine" tick={{ fontSize: 12 }} />
        <YAxis tick={{ fontSize: 11 }} width={32} />
        <Tooltip
          formatter={(value) => formatDuree(Number(value ?? 0), langue)}
          contentStyle={{
            borderRadius: 12,
            fontSize: 12,
            backgroundColor: 'var(--popover)',
            color: 'var(--popover-foreground)',
            border: '1px solid var(--border)',
          }}
        />
        <Bar
          dataKey="normales"
          name={labels.normales}
          stackId="h"
          fill="var(--success)"
          radius={[0, 0, 0, 0]}
        />
        <Bar
          dataKey="extra"
          name={labels.extra}
          stackId="h"
          fill="var(--warning)"
          radius={[4, 4, 0, 0]}
        />
      </BarChart>
    </ResponsiveContainer>
  )
}

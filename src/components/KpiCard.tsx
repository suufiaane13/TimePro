import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function KpiCard({
  label,
  value,
  accent,
}: {
  label: string
  value: string
  accent?: string
}) {
  return (
    <Card>
      <CardContent className="flex min-h-[5.5rem] flex-col items-center justify-center gap-1 p-4 text-center">
        <p className="text-xs leading-snug text-muted-foreground">{label}</p>
        <p className={cn('text-xl font-bold tabular-nums sm:text-2xl', accent ?? 'text-foreground')}>
          {value}
        </p>
      </CardContent>
    </Card>
  )
}

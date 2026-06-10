import { cn } from '@/lib/utils'

export function PageHeader({
  title,
  description,
  capitalizeDescription = false,
}: {
  title: string
  description?: string
  capitalizeDescription?: boolean
}) {
  return (
    <header className="text-center">
      <h1 className="text-lg font-semibold">{title}</h1>
      {description && (
        <p
          className={cn(
            'text-sm text-muted-foreground',
            capitalizeDescription && 'capitalize',
          )}
        >
          {description}
        </p>
      )}
    </header>
  )
}

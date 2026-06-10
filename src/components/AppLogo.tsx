import { cn } from '@/lib/utils'

const sizes = {
  xs: 'size-5',
  sm: 'size-8',
  md: 'size-10',
  lg: 'size-14',
} as const

type AppLogoProps = {
  size?: keyof typeof sizes
  showWordmark?: boolean
  className?: string
}

export function AppLogo({ size = 'sm', showWordmark = false, className }: AppLogoProps) {
  const imgClass = cn('shrink-0 rounded-xl object-cover', sizes[size])

  return (
    <div className={cn('flex min-w-0 items-center gap-2.5', className)}>
      <img src="/logo.png" alt="TimePro" className={cn(imgClass, 'dark:hidden os-dark:hidden')} />
      <img src="/logo-d.png" alt="TimePro" className={cn(imgClass, 'hidden dark:block os-dark:block')} />
      {showWordmark && (
        <span className="truncate text-sm font-semibold text-primary">TimePro</span>
      )}
    </div>
  )
}

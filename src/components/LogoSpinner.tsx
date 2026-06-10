import { AppLogo } from '@/components/AppLogo'
import { cn } from '@/lib/utils'

type LogoSpinnerProps = {
  size?: 'md' | 'lg'
  className?: string
  ariaLabel?: string
}

const RING = {
  md: 'size-20',
  lg: 'size-24',
} as const

const LOGO = {
  md: 'md' as const,
  lg: 'lg' as const,
}

/** Logo centré dans un anneau tournant */
export function LogoSpinner({ size = 'lg', className, ariaLabel = 'Loading' }: LogoSpinnerProps) {
  return (
    <div
      className={cn('relative flex items-center justify-center', RING[size], className)}
      role="status"
      aria-label={ariaLabel}
    >
      <div className={cn('logo-spinner-ring absolute inset-0 rounded-full', RING[size])} />
      <AppLogo size={LOGO[size]} className="relative z-10" />
    </div>
  )
}

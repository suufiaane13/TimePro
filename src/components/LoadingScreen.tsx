import { useTranslation } from 'react-i18next'
import { LogoSpinner } from '@/components/LogoSpinner'
import { cn } from '@/lib/utils'

type LoadingScreenProps = {
  exiting?: boolean
  className?: string
}

/** Plein écran au démarrage — logo dans le spinner */
export function LoadingScreen({ exiting = false, className }: LoadingScreenProps) {
  const { t } = useTranslation()

  return (
    <div
      className={cn(
        'loading-screen fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background',
        exiting && 'loading-screen-exit',
        className,
      )}
      aria-busy={!exiting}
      aria-live="polite"
    >
      <LogoSpinner size="lg" ariaLabel={t('common.loading')} />
      <p className="mt-6 text-sm font-medium text-muted-foreground">{t('app.name')}</p>
    </div>
  )
}

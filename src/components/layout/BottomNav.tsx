import { Calendar, Clock, Download, LayoutDashboard, Settings } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { NavLink } from 'react-router-dom'
import { cn } from '@/lib/utils'

const links = [
  { to: '/', icon: Clock, key: 'saisie' },
  { to: '/calendrier', icon: Calendar, key: 'calendrier' },
  { to: '/dashboard', icon: LayoutDashboard, key: 'dashboard' },
  { to: '/export', icon: Download, key: 'export' },
  { to: '/parametres', icon: Settings, key: 'parametres' },
] as const

export function BottomNav() {
  const { t, i18n } = useTranslation()
  const navKey = i18n.language

  return (
    <nav
      aria-label={t('nav.label')}
      className="fixed inset-x-0 bottom-0 z-50 border-t border-border bg-background/95 backdrop-blur transition-colors duration-300 supports-[backdrop-filter]:bg-background/80"
    >
      <div
        key={navKey}
        className="nav-enter mx-auto flex max-w-md items-stretch justify-around px-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] pt-2"
      >
        {links.map(({ to, icon: Icon, key }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) =>
              cn(
                'flex min-h-11 min-w-14 flex-col items-center justify-center gap-0.5 rounded-2xl px-2 text-xs transition-all duration-200 active:scale-95',
                isActive
                  ? 'text-primary'
                  : 'text-muted-foreground hover:text-foreground',
              )
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={cn('size-5', isActive && 'fill-primary/15')} aria-hidden />
                <span className="font-medium">{t(`nav.${key}`)}</span>
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  )
}

import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { LanguageSwitcher } from '@/components/LanguageSwitcher'
import { AppLogo } from '@/components/AppLogo'
import { ThemeToggle } from '@/components/ThemeToggle'
import { AnimatedHeaderText } from '@/components/layout/AnimatedHeaderText'
import { AnimatedOutlet } from '@/components/layout/AnimatedOutlet'
import { BottomNav } from '@/components/layout/BottomNav'
import { usePresences } from '@/store/usePresences'
import { applyTheme } from '@/utils/theme'

export function AppShell() {
  const { t, i18n } = useTranslation()
  const langue = usePresences((s) => s.langue)
  const theme = usePresences((s) => s.theme)
  const profil = usePresences((s) => s.profil)

  useEffect(() => {
    document.documentElement.dir = langue === 'ar' ? 'rtl' : 'ltr'
    document.documentElement.lang = langue
    void i18n.changeLanguage(langue)
  }, [langue, i18n])

  useEffect(() => {
    applyTheme(theme)

    if (theme !== 'system') return

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => applyTheme('system')
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [theme])

  return (
    <div className="mx-auto flex min-h-svh w-full max-w-md flex-col bg-background">
      <header className="sticky top-0 z-40 border-b border-border bg-background/95 px-4 py-3 backdrop-blur transition-colors duration-300">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 flex-1 items-center gap-2.5 text-start">
            <AppLogo size="sm" />
            <AnimatedHeaderText>
              <p className="truncate text-sm font-semibold text-primary">{t('app.name')}</p>
              <p className="truncate text-xs text-muted-foreground">
                {profil.prenom} {profil.nom}
              </p>
            </AnimatedHeaderText>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <ThemeToggle />
            <LanguageSwitcher />
          </div>
        </div>
      </header>

      <main className="app-scroll flex-1 overflow-y-scroll px-4 py-4 pb-24">
        <AnimatedOutlet />
      </main>

      <BottomNav />
    </div>
  )
}

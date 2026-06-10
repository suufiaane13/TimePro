import { Monitor, Moon, Sun } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { usePresences } from '@/store/usePresences'
import type { ThemeMode } from '@/types'
import { useResolvedTheme } from '@/hooks/useResolvedTheme'

const MODES: ThemeMode[] = ['light', 'dark', 'system']

const ICONS = {
  light: Sun,
  dark: Moon,
  system: Monitor,
} as const

export function ThemeToggle() {
  const { t } = useTranslation()
  const setTheme = usePresences((s) => s.setTheme)
  const resolved = useResolvedTheme()
  const Icon = resolved === 'dark' ? Moon : Sun

  const toggle = () => {
    setTheme(resolved === 'dark' ? 'light' : 'dark')
  }

  return (
    <Button
      variant="outline"
      size="icon"
      className="size-9 shrink-0 border-transparent bg-muted/30 transition-colors duration-300 hover:bg-muted/50"
      onClick={toggle}
      aria-label={t('theme.toggle')}
    >
      <Icon key={resolved} className="icon-pop size-4" />
    </Button>
  )
}

export function ThemeSelector() {
  const { t } = useTranslation()
  const theme = usePresences((s) => s.theme)
  const setTheme = usePresences((s) => s.setTheme)

  return (
    <div className="grid grid-cols-3 gap-2">
      {MODES.map((mode) => {
        const Icon = ICONS[mode]
        const selected = theme === mode

        return (
          <Button
            key={mode}
            type="button"
            variant={selected ? 'default' : 'outline'}
            className={cn(
              'h-auto flex-col gap-1.5 py-3 transition-all duration-200 active:scale-95',
              !selected && 'border-transparent bg-muted/30 hover:bg-muted/50',
            )}
            onClick={() => setTheme(mode)}
          >
            <Icon className="size-4" />
            <span className="text-xs font-medium">{t(`theme.${mode}`)}</span>
          </Button>
        )
      })}
    </div>
  )
}

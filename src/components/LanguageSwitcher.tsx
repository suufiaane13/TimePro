import { ChevronDown, Languages } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/components/ui/button'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { LANG_META, LANGUES } from '@/constants/langues'
import { cn } from '@/lib/utils'
import { usePresences } from '@/store/usePresences'
import type { LangueUI } from '@/types'

export function LanguageSwitcher() {
  const { t } = useTranslation()
  const langue = usePresences((s) => s.langue)
  const setLangue = usePresences((s) => s.setLangue)
  const [open, setOpen] = useState(false)

  const selectLangue = (code: LangueUI) => {
    setLangue(code)
    setOpen(false)
  }

  return (
    <DropdownMenu open={open} onOpenChange={setOpen}>
      <DropdownMenuTrigger
        render={
          <Button
            variant="outline"
            size="sm"
            className="h-9 gap-1.5 border-transparent bg-muted/30 px-2.5 hover:bg-muted/50 sm:px-3"
            aria-label={t('langue.label')}
          >
            <Languages className="size-4 shrink-0 text-primary" />
            <span className="hidden max-w-24 truncate text-sm font-medium sm:inline">
              {LANG_META[langue].label}
            </span>
            <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[10px] font-bold leading-none text-primary">
              {LANG_META[langue].code}
            </span>
            <ChevronDown className="size-3.5 shrink-0 text-muted-foreground" />
          </Button>
        }
      />
      <DropdownMenuContent align="end" className="min-w-52 p-2">
        <DropdownMenuGroup>
          <DropdownMenuLabel className="px-2 py-1.5 text-xs font-medium uppercase tracking-wide">
            {t('langue.label')}
          </DropdownMenuLabel>
          <DropdownMenuRadioGroup
            value={langue}
            onValueChange={(value) => selectLangue(value as LangueUI)}
          >
            {LANGUES.map((code) => {
              const meta = LANG_META[code]
              const selected = langue === code

              return (
                <DropdownMenuRadioItem
                  key={code}
                  value={code}
                  onClick={() => setOpen(false)}
                  className={cn(
                    'gap-3 py-2.5 pe-8',
                    selected && 'bg-primary/5 focus:bg-primary/10',
                  )}
                >
                  <span
                    className={cn(
                      'flex size-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold',
                      selected
                        ? 'bg-primary text-primary-foreground'
                        : 'bg-muted text-muted-foreground',
                    )}
                  >
                    {meta.code}
                  </span>
                  <span
                    className="text-sm font-medium leading-none"
                    dir={code === 'ar' ? 'rtl' : 'ltr'}
                  >
                    {meta.label}
                  </span>
                </DropdownMenuRadioItem>
              )
            })}
          </DropdownMenuRadioGroup>
        </DropdownMenuGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

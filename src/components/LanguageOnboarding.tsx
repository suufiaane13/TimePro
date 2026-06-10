import { AppLogo } from '@/components/AppLogo'
import { Button } from '@/components/ui/button'
import { LANG_META, LANGUES } from '@/constants/langues'
import { cn } from '@/lib/utils'
import { usePresences } from '@/store/usePresences'
import type { LangueUI } from '@/types'

/** Premier lancement — choix obligatoire de la langue UI */
export function LanguageOnboarding() {
  const setLangue = usePresences((s) => s.setLangue)

  const choose = (code: LangueUI) => {
    setLangue(code)
  }

  return (
    <div className="page-enter fixed inset-0 z-[100] flex flex-col items-center justify-center bg-background px-6">
      <AppLogo size="lg" className="mb-6" />
      <h1 className="text-xl font-semibold text-foreground">TimePro</h1>
      <p className="mt-2 text-center text-sm text-muted-foreground">
        Scegli la lingua · اختار اللغة
      </p>

      <div className="mt-8 flex w-full max-w-sm flex-col gap-3">
        {LANGUES.map((code) => {
          const meta = LANG_META[code]
          return (
            <Button
              key={code}
              type="button"
              variant="outline"
              size="lg"
              className={cn(
                'h-auto flex-col items-start gap-1 rounded-3xl px-5 py-4 text-start',
                'border-border bg-card hover:bg-accent/50',
              )}
              onClick={() => choose(code)}
            >
              <span className="flex w-full items-center gap-3">
                <span className="flex size-9 shrink-0 items-center justify-center rounded-full bg-primary text-[11px] font-bold text-primary-foreground">
                  {meta.code}
                </span>
                <span className="text-base font-semibold" dir={code === 'ar' ? 'rtl' : 'ltr'}>
                  {meta.label}
                </span>
              </span>
              <span className="ps-12 text-xs text-muted-foreground">{meta.descriptionIt}</span>
            </Button>
          )
        })}
      </div>
    </div>
  )
}

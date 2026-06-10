import { AppLogo } from '@/components/AppLogo'
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

      <div className="mt-8 grid w-full max-w-sm grid-cols-1 gap-4 sm:max-w-md sm:grid-cols-2">
        {LANGUES.map((code) => {
          const meta = LANG_META[code]
          const description = code === 'ar' ? meta.descriptionAr : meta.descriptionIt

          return (
            <button
              key={code}
              type="button"
              onClick={() => choose(code)}
              className={cn(
                'flex min-h-[9.5rem] flex-col items-center justify-center gap-2.5 rounded-4xl',
                'border border-border bg-card px-4 py-6 text-center shadow-md',
                'ring-1 ring-foreground/5 transition-all duration-200',
                'hover:border-primary/40 hover:bg-primary/5 hover:shadow-lg active:scale-[0.98]',
              )}
            >
              <span className="flex size-11 items-center justify-center rounded-full bg-primary text-sm font-bold text-primary-foreground">
                {meta.code}
              </span>
              <span
                className="text-base font-semibold leading-snug text-foreground"
                dir={code === 'ar' ? 'rtl' : 'ltr'}
              >
                {meta.label}
              </span>
              <span className="max-w-[11rem] text-xs leading-relaxed text-muted-foreground">
                {description}
              </span>
            </button>
          )
        })}
      </div>
    </div>
  )
}

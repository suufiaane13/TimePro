import { useEffect, useState } from 'react'
import App from '@/App'
import { ErrorBoundary } from '@/components/ErrorBoundary'
import { LanguageOnboarding } from '@/components/LanguageOnboarding'
import { LoadingScreen } from '@/components/LoadingScreen'
import { usePresences } from '@/store/usePresences'

const MIN_LOADING_MS = 2000
const EXIT_MS = 280

/** Affiche l'écran de chargement jusqu'à la réhydratation + délai minimum */
export function AppBootstrap() {
  const [visible, setVisible] = useState(true)
  const [exiting, setExiting] = useState(false)
  const langueChoisie = usePresences((s) => s.langueChoisie)

  useEffect(() => {
    const start = Date.now()

    const finish = () => {
      const remaining = Math.max(0, MIN_LOADING_MS - (Date.now() - start))

      window.setTimeout(() => {
        setExiting(true)
        window.setTimeout(() => {
          setVisible(false)
          document.documentElement.classList.remove('no-theme-transition')
        }, EXIT_MS)
      }, remaining)
    }

    if (usePresences.persist.hasHydrated()) {
      finish()
      return
    }

    return usePresences.persist.onFinishHydration(finish)
  }, [])

  return (
    <ErrorBoundary>
      {visible && <LoadingScreen exiting={exiting} />}
      {!visible && !langueChoisie && <LanguageOnboarding />}
      {!visible && langueChoisie && <App />}
    </ErrorBoundary>
  )
}

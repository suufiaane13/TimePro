import { useEffect, useState } from 'react'
import { usePresences } from '@/store/usePresences'
import { resolveTheme } from '@/utils/theme'

export function useResolvedTheme() {
  const themeMode = usePresences((s) => s.theme)
  const [, rerender] = useState(0)

  useEffect(() => {
    if (themeMode !== 'system') return undefined

    const mq = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => rerender((n) => n + 1)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [themeMode])

  return resolveTheme(themeMode)
}

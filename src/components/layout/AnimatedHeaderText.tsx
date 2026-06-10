import type { ReactNode } from 'react'
import { usePresences } from '@/store/usePresences'

/** Animation légère du bloc header au changement de langue (RTL/LTR) */
export function AnimatedHeaderText({ children }: { children: ReactNode }) {
  const langue = usePresences((s) => s.langue)

  return (
    <div key={langue} className="header-enter min-w-0">
      {children}
    </div>
  )
}

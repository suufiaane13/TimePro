import { Outlet, useLocation } from 'react-router-dom'
import { usePresences } from '@/store/usePresences'

/** Rejoue une entrée douce à chaque navigation ou changement de langue */
export function AnimatedOutlet() {
  const location = useLocation()
  const langue = usePresences((s) => s.langue)
  const pageKey = `${location.pathname}-${langue}`

  return (
    <div key={pageKey} className="page-enter">
      <Outlet />
    </div>
  )
}

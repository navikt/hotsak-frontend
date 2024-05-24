import type { ReactNode } from 'react'
import { Navigate } from 'react-router'

import { useInnloggetSaksbehandler } from './state/authentication'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { erInnlogget } = useInnloggetSaksbehandler()
  return erInnlogget === false ? <Navigate to="/uautorisert" replace /> : <>{children}</>
}

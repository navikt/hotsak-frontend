import React from 'react'
import { Navigate } from 'react-router'

import { useInnloggetSaksbehandler } from './state/authentication'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { erInnlogget } = useInnloggetSaksbehandler()
  return erInnlogget === false ? <Navigate to="/uautorisert" replace /> : <>{children}</>
}

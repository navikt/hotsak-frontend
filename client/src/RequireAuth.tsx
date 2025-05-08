import type { ReactNode } from 'react'
import { Navigate } from 'react-router'

import { useInnloggetAnsatt } from './tilgang/useTilgang.ts'

export function RequireAuth({ children }: { children: ReactNode }) {
  const { erInnlogget } = useInnloggetAnsatt()
  return erInnlogget === false ? <Navigate to="/uautorisert" replace /> : <>{children}</>
}

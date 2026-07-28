import { Navigate, Outlet } from 'react-router'

import { useInnloggetAnsatt } from './useTilgang.ts'

export function Protected() {
  const { erInnlogget } = useInnloggetAnsatt()
  if (!erInnlogget) {
    return <Navigate to="/uautorisert" />
  }
  return <Outlet />
}

import { Navigate } from 'react-router'
import { Outlet } from 'react-router-dom'
import { useInnloggetAnsatt } from './useTilgang.ts'

export function Protected() {
  const { erInnlogget } = useInnloggetAnsatt()
  if (!erInnlogget) {
    return <Navigate to="/uautorisert" />
  }
  return <Outlet />
}

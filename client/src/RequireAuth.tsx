import React from 'react'
import { Navigate } from 'react-router'
import { useRecoilValue } from 'recoil'

import { authState } from './state/authentication'

export function RequireAuth({ children }: { children: React.ReactNode }) {
  const { isLoggedIn } = useRecoilValue(authState)
  return isLoggedIn === false ? <Navigate to="/uautorisert" replace /> : <>{children}</>
}

import * as React from 'react'
import { Redirect, Route, RouteProps } from 'react-router'

import { useRecoilValue } from 'recoil'

import { authState } from './state/authentication'

export const ProtectedRoute = ({ children, ...rest }: RouteProps) => {
  const { isLoggedIn } = useRecoilValue(authState)

  return <Route {...rest} render={() => (isLoggedIn !== false ? <>{children}</> : <Redirect to="/uautorisert" />)} />
}

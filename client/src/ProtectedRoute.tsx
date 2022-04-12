import React from 'react'
import { Redirect, Route, RouteProps } from 'react-router'
import { useRecoilValue } from 'recoil'

import { authState } from './state/authentication'

export const ProtectedRoute: React.FC<RouteProps> = ({ children, ...rest }) => {
  const { isLoggedIn } = useRecoilValue(authState)

  return <Route {...rest} render={() => (isLoggedIn !== false ? <>{children}</> : <Redirect to="/uautorisert" />)} />
}

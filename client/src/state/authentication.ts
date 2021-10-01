import fetchIntercept from 'fetch-intercept'
import { Saksbehandler } from '../types/types.internal'
import { useEffect } from 'react'
import { atom, useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'

import { extractValues, Keys } from '../utils/cookie'

interface AuthInfo {
  name: string
  email?: string
  ident?: string
  oid?: string
  isLoggedIn?: boolean
}

export const authState = atom<AuthInfo>({
  key: 'auth',
  default: {
    name: '',
    ident: undefined,
    email: undefined,
    oid: undefined,
    isLoggedIn: undefined,
  },
})

export const useInnloggetSaksbehandler = (): Saksbehandler => {
  const authInfo = useRecoilValue(authState) as Required<AuthInfo>

  return {
    objectId: authInfo.oid,
    navn: authInfo.name,
    epost: authInfo.email,
  }
}

export const useAuthentication = () => {
  const [authInfo, setAuthInfo] = useRecoilState(authState)
  const resetAuthInfo = useResetRecoilState(authState)
  const [name, ident, email, oid] = extractValues([Keys.NAME, Keys.IDENT, Keys.EMAIL, Keys.OID])

  useEffect(() => {
    if (name && name !== authInfo.name) {
      setAuthInfo({
        name,
        ident,
        email,
        oid,
        isLoggedIn: true,
      })
    }
  }, [name, ident, email, oid, authInfo, setAuthInfo])

  useEffect(() => {
    fetchIntercept.register({
      response: (res) => {
        if (res.status === 401) {
          resetAuthInfo()
        }
        return res
      },
    })
  }, [resetAuthInfo])
}

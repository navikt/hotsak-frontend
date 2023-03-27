import fetchIntercept from 'fetch-intercept'
import { useEffect } from 'react'
import { atom, useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import useSwr from 'swr'

import { httpGet } from '../io/http'

type Gruppe = string | 'TEAMDIGIHOT' | 'HOTSAK_BRUKERE' | 'BRILLEADMIN_BRUKERE'
type Enhet = string | '2103' | '4710'

export interface InnloggetSaksbehandler {
  id: string
  objectId: string
  navn: string
  epost: string
  navIdent: string
  grupper: Gruppe[]
  enheter: Enhet[]
  erInnlogget?: boolean
}

export const innloggetSaksbehandlerState = atom<InnloggetSaksbehandler>({
  key: 'auth',
  default: {
    id: '',
    objectId: '',
    navn: '',
    epost: '',
    navIdent: '',
    grupper: [],
    enheter: [],
    erInnlogget: undefined,
  },
})

export function useInnloggetSaksbehandler(): InnloggetSaksbehandler {
  return useRecoilValue<InnloggetSaksbehandler>(innloggetSaksbehandlerState)
}

export function useVisOppgavelisteTabs() {
  const { grupper, enheter } = useInnloggetSaksbehandler()
  return grupper.includes('BRILLEADMIN_BRUKERE') || enheter.includes('2103')
}

export const useAuthentication = (): void => {
  const { data, error } = useSwr<{ data: InnloggetSaksbehandler }>('api/tilgang', httpGet)
  const [innloggetSaksbehandler, setInnloggetSaksbehandler] = useRecoilState(innloggetSaksbehandlerState)
  const resetInnloggetSaksbehandler = useResetRecoilState(innloggetSaksbehandlerState)

  useEffect(() => {
    if (data && data.data.id !== innloggetSaksbehandler.id) {
      setInnloggetSaksbehandler({
        ...data.data,
        erInnlogget: true,
      })
    }
  }, [data, innloggetSaksbehandler, setInnloggetSaksbehandler])

  useEffect(() => {
    if (error) {
      resetInnloggetSaksbehandler()
    }
  }, [error, resetInnloggetSaksbehandler])

  useEffect(() => {
    fetchIntercept.register({
      response: (res) => {
        if (res.status === 401) {
          resetInnloggetSaksbehandler()
        }
        return res
      },
    })
  }, [resetInnloggetSaksbehandler])
}

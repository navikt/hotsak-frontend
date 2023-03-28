import fetchIntercept from 'fetch-intercept'
import { useEffect } from 'react'
import { atom, selector, useRecoilState, useRecoilValue, useResetRecoilState } from 'recoil'
import useSwr from 'swr'

import { httpGet } from '../io/http'

export enum Gruppe {
  TEAMDIGIHOT = 'TEAMDIGIHOT',
  HOTSAK_BRUKERE = 'HOTSAK_BRUKERE',
  BRILLEADMIN_BRUKERE = 'BRILLEADMIN_BRUKERE',
}

const Enhet = {
  NAV_VIKAFOSSEN: '2103',
  NAV_HJELPEMIDDELSENTRAL_AGDER: '4710',
}

export interface InnloggetSaksbehandler {
  id: string
  objectId: string
  navn: string
  epost: string
  navIdent: string
  grupper: Gruppe[]
  enheter: string[]
  erInnlogget?: boolean
}

const innloggetSaksbehandlerState = atom<InnloggetSaksbehandler>({
  key: 'InnloggetSaksbehandler',
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

const visOppgavelisteTabsState = selector<boolean>({
  key: 'VisOppgavelisteTabs',
  get: ({ get }) => {
    const { grupper, enheter } = get(innloggetSaksbehandlerState)
    return (
      window.appSettings.MILJO !== 'prod-gcp' ||
      grupper.includes(Gruppe.TEAMDIGIHOT) ||
      grupper.includes(Gruppe.BRILLEADMIN_BRUKERE) ||
      enheter.includes(Enhet.NAV_VIKAFOSSEN)
    )
  },
})

export function useInnloggetSaksbehandler(): InnloggetSaksbehandler {
  return useRecoilValue<InnloggetSaksbehandler>(innloggetSaksbehandlerState)
}

export function useVisOppgavelisteTabs() {
  return useRecoilValue<boolean>(visOppgavelisteTabsState)
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

import useSwr from 'swr'
import { ReactNode, useEffect, useState } from 'react'
import fetchIntercept from 'fetch-intercept'

import { httpGet } from '../io/http.ts'
import type { InnloggetSaksbehandler } from '../state/authentication.ts'
import { TilgangContext, TilgangContextType } from './TilgangContext.ts'

interface TilgangContextProviderProps {
  children: ReactNode
}

export function TilgangContextProvider({ children }: TilgangContextProviderProps) {
  const { data, error } = useSwr<{ data: InnloggetSaksbehandler }>('api/saksbehandler', httpGet)
  const [state, setState] = useState<TilgangContextType>(initialState)
  const resetInnloggetSaksbehandler = () => setState(initialState)

  useEffect(() => {
    if (data && data.data && data.data.id !== state.innloggetSaksbehandler.id) {
      setState({ innloggetSaksbehandler: { ...data.data, erInnlogget: true } })
    }
  }, [data, state.innloggetSaksbehandler.id])
  useEffect(() => {
    if (error) {
      resetInnloggetSaksbehandler()
    }
  }, [error])
  useEffect(() => {
    fetchIntercept.register({
      response: (response) => {
        if (response.status === 401) {
          resetInnloggetSaksbehandler()
        }
        return response
      },
    })
  }, [])

  return <TilgangContext.Provider value={state}>{children}</TilgangContext.Provider>
}

const initialState: TilgangContextType = {
  innloggetSaksbehandler: {
    id: '',
    navn: '',
    epost: '',
    navIdent: '',
    grupper: [],
    enhetsnumre: [],
  },
}

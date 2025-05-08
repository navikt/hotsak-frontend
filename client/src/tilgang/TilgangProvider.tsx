import useSwr from 'swr'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import fetchIntercept from 'fetch-intercept'

import { httpGet } from '../io/http.ts'
import { initialState, TilgangContext, TilgangContextType } from './TilgangContext.ts'
import { InnloggetAnsatt } from './Ansatt.ts'

export function TilgangProvider({ children }: { children: ReactNode }) {
  const { data, error } = useSwr<{ data: InnloggetAnsatt }>('api/saksbehandler', httpGet)
  const [erInnlogget, setErInnlogget] = useState<boolean | null>(null)

  useEffect(() => {
    return fetchIntercept.register({
      response(response) {
        if (response.status === 401) {
          setErInnlogget(false)
        }
        return response
      },
    })
  }, [])

  const value = useMemo<TilgangContextType>(() => {
    if (error || erInnlogget === false) {
      return {
        ...initialState,
        innloggetAnsatt: {
          ...initialState.innloggetAnsatt,
          erInnlogget: false,
        },
      }
    }

    const innloggetAnsatt = data?.data
    if (!innloggetAnsatt) {
      return initialState
    }

    const enheter = innloggetAnsatt.enheter.toSorted(({ navn: a }, { navn: b }) => a.localeCompare(b))
    return {
      innloggetAnsatt: {
        ...innloggetAnsatt,
        enheter,
        erInnlogget: true,
      },
      valgtEnhet: enheter.find(({ gjeldende }) => gjeldende) ?? enheter[0],
      setValgtEnhet() {},
    }
  }, [data, error, erInnlogget])

  return <TilgangContext.Provider value={value}>{children}</TilgangContext.Provider>
}

import fetchIntercept from 'fetch-intercept'
import { ReactNode, useEffect, useMemo, useState } from 'react'
import useSwr from 'swr'

import { http } from '../io/HttpClient.ts'
import type { HttpError } from '../io/HttpError.ts'
import { InnloggetAnsatt } from './Ansatt.ts'
import { initialState, TilgangContext, TilgangContextType } from './TilgangContext.ts'

export function TilgangProvider({ children }: { children: ReactNode }) {
  const { data: innloggetAnsatt, error } = useSwr<InnloggetAnsatt, HttpError>('/api/ansatte/meg')
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

    if (!innloggetAnsatt) {
      return initialState
    }

    return {
      innloggetAnsatt: {
        ...innloggetAnsatt,
        erInnlogget: true,
      },
      async setValgtEnhet(nummer) {
        await http.post('/api/ansatte/enhet', { valgtEnhetsnummer: nummer })
        window.location.href = '/'
      },
    }
  }, [innloggetAnsatt, error, erInnlogget])

  return <TilgangContext.Provider value={value}>{children}</TilgangContext.Provider>
}

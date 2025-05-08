import useSwr from 'swr'
import { ReactNode, useEffect, useMemo } from 'react'
import fetchIntercept from 'fetch-intercept'

import { httpGet } from '../io/http.ts'
import { initialState, TilgangContext, TilgangContextType } from './TilgangContext.ts'
import { InnloggetAnsatt } from './Ansatt.ts'
import { useSessionState } from '../state/useSessionState.ts'

export function TilgangProvider({ children }: { children: ReactNode }) {
  const { data, error, mutate } = useSwr<{ data: InnloggetAnsatt }>('api/saksbehandler', httpGet)
  const [valgtEnhet, setValgtEnhet] = useSessionState<string | null>('valgtEnhet', null)

  useEffect(() => {
    return fetchIntercept.register({
      request(url, config) {
        if (valgtEnhet?.length === 4) {
          const { headers, ...rest } = config
          return [
            url,
            {
              ...rest,
              headers: {
                'X-Valgt-Enhet': valgtEnhet,
                ...headers,
              },
            },
          ]
        }
        return [url, config]
      },
      response(response) {
        if (response.status === 401) {
          // noinspection JSIgnoredPromiseFromCall
          mutate({ data: initialState.innloggetAnsatt })
        }
        return response
      },
    })
  }, [mutate, valgtEnhet])

  const value = useMemo<TilgangContextType>(() => {
    if (error) {
      return initialState
    }

    const innloggetAnsatt = data?.data
    if (!innloggetAnsatt) {
      return initialState
    }

    const enheter = innloggetAnsatt.enheter
      .toSorted(({ navn: a }, { navn: b }) => a.localeCompare(b))
      .map((enhet) => {
        return {
          ...enhet,
          gjeldende: valgtEnhet ? valgtEnhet === enhet.nummer : enhet.gjeldende,
        }
      })
    return {
      innloggetAnsatt: {
        ...innloggetAnsatt,
        enheter,
        erInnlogget: true,
      },
      valgtEnhet: enheter.find(({ gjeldende }) => gjeldende) ?? enheter[0],
      setValgtEnhet,
    }
  }, [data, error, valgtEnhet, setValgtEnhet])

  useEffect(() => {
    if (valgtEnhet) {
      // noinspection JSIgnoredPromiseFromCall
      mutate()
    }
  }, [mutate, valgtEnhet])

  return <TilgangContext.Provider value={value}>{children}</TilgangContext.Provider>
}

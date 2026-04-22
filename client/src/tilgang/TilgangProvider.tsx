import { type ReactNode, useMemo } from 'react'
import useSwr from 'swr'

import { http } from '../io/HttpClient.ts'
import { type HttpError } from '../io/HttpError.ts'
import { type InnloggetAnsatt } from './Ansatt.ts'
import { initialState, TilgangContext, type TilgangContextType } from './TilgangContext.ts'

export function TilgangProvider({ children }: { children: ReactNode }) {
  const { data: innloggetAnsatt, error } = useSwr<InnloggetAnsatt, HttpError>('/api/ansatte/meg', { suspense: true })

  const value = useMemo<TilgangContextType>(() => {
    if (error) {
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
  }, [innloggetAnsatt, error])

  return <TilgangContext value={value}>{children}</TilgangContext>
}

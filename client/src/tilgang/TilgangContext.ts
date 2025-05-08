import { createContext } from 'react'

import type { AnsattEnhet, InnloggetAnsatt } from './Ansatt.ts'

export interface TilgangContextType {
  innloggetAnsatt: InnloggetAnsatt
  valgtEnhet: AnsattEnhet
  setValgtEnhet(nummer: string): void
}

export const initialState: TilgangContextType = {
  innloggetAnsatt: {
    id: '',
    navn: '',
    epost: '',
    grupper: [],
    enheter: [],
    gradering: [],
    enhetsnumre: [],
  },
  valgtEnhet: {
    id: '',
    nummer: '',
    navn: '',
    gjeldende: true,
  },
  setValgtEnhet() {},
}

export const TilgangContext = createContext<TilgangContextType>(initialState)
TilgangContext.displayName = 'Tilgang'

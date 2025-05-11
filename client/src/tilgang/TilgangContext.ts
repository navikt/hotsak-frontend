import { createContext } from 'react'

import type { InnloggetAnsatt } from './Ansatt.ts'

export interface TilgangContextType {
  innloggetAnsatt: InnloggetAnsatt
  setValgtEnhet(nummer: string): Promise<void>
}

export const initialState: TilgangContextType = {
  innloggetAnsatt: {
    id: '',
    navn: '',
    epost: '',
    grupper: [],
    enheter: [],
    gjeldendeEnhet: {
      id: '',
      nummer: '',
      navn: '',
      gjeldende: true,
    },
    gradering: [],
    enhetsnumre: [],
  },
  async setValgtEnhet() {},
}

export const TilgangContext = createContext<TilgangContextType>(initialState)
TilgangContext.displayName = 'Tilgang'

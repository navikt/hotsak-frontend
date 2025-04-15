import { createContext } from 'react'
import type { InnloggetSaksbehandler } from '../state/authentication.ts'

const innloggetSaksbehandler: Readonly<InnloggetSaksbehandler> = {
  id: '',
  navn: '',
  epost: '',
  navIdent: '',
  grupper: [],
  enhetsnumre: [],
}

const initialState = {
  innloggetSaksbehandler,
} as const

export type TilgangContextType = typeof initialState

export const TilgangContext = createContext<TilgangContextType>(initialState)
TilgangContext.displayName = 'TilgangContext'

import { createContext } from 'react'
import type { InnloggetSaksbehandler } from '../state/authentication.ts'

const innloggetSaksbehandler: InnloggetSaksbehandler = {
  id: '',
  navn: '',
  epost: '',
  grupper: [],
  enhetsnumre: [],
}

export const initialState = {
  innloggetSaksbehandler,
} as const

export type TilgangState = typeof initialState

export const TilgangContext = createContext<TilgangState>(initialState)
TilgangContext.displayName = 'Tilgang'

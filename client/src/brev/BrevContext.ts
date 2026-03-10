import { createContext, useContext } from 'react'
import { PlaceholderFeil } from './breveditor/plugins/placeholder/PlaceholderFeil'

export interface BrevContextType {
  placeholderFeil: PlaceholderFeil[]
  setPlaceholderFeil: (feil: PlaceholderFeil[]) => void
  synligKryssKnapp: boolean
  setSynligKryssKnapp: (synlig: boolean) => void
  datoSoknadMottatt: string | undefined
  hjelpemidlerSøktOm: string[] | undefined
}

export const BrevContext = createContext<BrevContextType | undefined>(undefined)

export const useBrevContext = () => {
  const ctx = useContext(BrevContext)
  if (!ctx) throw new Error('useBrevContext must be used within BrevContextProvider')
  return ctx
}

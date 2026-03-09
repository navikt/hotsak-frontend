import { createContext, useContext } from "react"

export interface BreveditorContextType {
  erPlateContentFokusert: boolean
  fokuserPlateContent: () => void
  erVerktoylinjeFokusert: boolean
  settVerktoylinjeFokusert: (fokus: boolean) => void
  erBreveditorEllerVerktoylinjeFokusert: boolean
  visMarger: boolean
  settVisMarger: (visMarger: boolean) => void
  endringsstatus: { lagrerNå: boolean; erEndret: boolean; error?: string }
  focusPath: (path: number[]) => void
}

export const BreveditorContext = createContext<BreveditorContextType | undefined>(undefined)

export const useBreveditorContext = () => {
  const ctx = useContext(BreveditorContext)
  if (!ctx) console.error('BreveditorContext må eksistere utenfor alle andre breveditor komponenter!')
  return ctx!
}
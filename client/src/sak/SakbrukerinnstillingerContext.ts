import { createContext, type Dispatch, useCallback, useContext } from 'react'

export type SakbrukerinnstillingerKey = 'merOmFormidler' | 'merOmOppfølgingsansvarlig'

export interface SakbrukerinnstillingerState {
  expandedSections: Partial<Record<SakbrukerinnstillingerKey, boolean>>
}

export const initialSakbrukerinnstillingerState: SakbrukerinnstillingerState = {
  expandedSections: {},
}

export type SakbrukerinnstillingerAction =
  | { type: 'setExpanded'; key: SakbrukerinnstillingerKey; expanded: boolean }
  | { type: 'toggleExpanded'; key: SakbrukerinnstillingerKey }

export const SakbrukerinnstillingerContext = createContext<SakbrukerinnstillingerState>(
  initialSakbrukerinnstillingerState
)
export const SakbrukerinnstillingerDispatch = createContext<Dispatch<SakbrukerinnstillingerAction>>(() => {})

export function useSakbrukerinnstillinger(): SakbrukerinnstillingerState {
  return useContext(SakbrukerinnstillingerContext)
}

export function useSakbrukerinnstillingerDispatch(): Dispatch<SakbrukerinnstillingerAction> {
  return useContext(SakbrukerinnstillingerDispatch)
}

export function useExpandedSection(key: SakbrukerinnstillingerKey): [boolean, (expanded: boolean) => void] {
  const { expandedSections } = useSakbrukerinnstillinger()
  const dispatch = useSakbrukerinnstillingerDispatch()
  const isExpanded = expandedSections[key] ?? false
  const setExpanded = useCallback(
    (expanded: boolean) => {
      dispatch({ type: 'setExpanded', key, expanded })
    },
    [dispatch, key]
  )
  return [isExpanded, setExpanded]
}

import { useCallback, useContext, useMemo, useState, type ReactNode } from 'react'
import { PersonContext } from './PersonContext'

export function PersonProvider({ initialFnr = '', children }: { initialFnr?: string; children: ReactNode }) {
  const parent = useContext(PersonContext)
  const [fodselsnummer, setState] = useState(initialFnr)

  const setFodselsnummer = useCallback(
    (fnr: string) => {
      setState(fnr)
      parent?.setFodselsnummer?.(fnr)
    },
    [parent]
  )

  const value = useMemo(() => ({ fodselsnummer, setFodselsnummer }), [fodselsnummer, setFodselsnummer])
  return <PersonContext value={value}>{children}</PersonContext>
}

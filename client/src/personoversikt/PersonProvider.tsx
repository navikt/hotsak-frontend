import { useCallback, useContext, useMemo, useState, type ReactNode } from 'react'

import { isLocal } from '../utils/useMiljø'
import { PersonContext } from './PersonContext'

export function PersonProvider({
  initialFnr = sessionFnr.get(),
  children,
}: {
  initialFnr?: string
  children: ReactNode
}) {
  const [fodselsnummer, setState] = useState(initialFnr)
  const parent = useContext(PersonContext)

  const setFodselsnummer = useCallback(
    (fnr: string) => {
      sessionFnr.set(fnr)
      setState(fnr)
      parent?.setFodselsnummer?.(fnr)
    },
    [parent]
  )

  const value = useMemo(() => ({ fodselsnummer, setFodselsnummer }), [fodselsnummer, setFodselsnummer])
  return <PersonContext value={value}>{children}</PersonContext>
}

const sessionFnr = {
  KEY: 'devFnr',
  get() {
    return sessionStorage.getItem(this.KEY) ?? ''
  },
  set(fnr: string) {
    if (isLocal() && window) sessionStorage.setItem(this.KEY, fnr)
  },
} as const

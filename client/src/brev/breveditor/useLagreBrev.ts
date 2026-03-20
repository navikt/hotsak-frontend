import { useEffect, useRef, useState } from 'react'
import type { StateMangement } from './Breveditor.tsx'

// Interface for å tracke endringsstatus (er alle endringer lagret)
export interface Endringsstatus {
  lagrerNå: boolean
  erEndret: boolean
  error?: string
}

export function useLagreBrev(onLagreBrev?: (state: StateMangement) => Promise<void>) {
  const debounceLagring = useRef<NodeJS.Timeout | undefined>(undefined)
  const [endringsstatus, setEndringsstatus] = useState<Endringsstatus>({
    lagrerNå: false,
    erEndret: false,
  })

  useEffect(() => {
    return () => clearTimeout(debounceLagring.current)
  }, [])

  const lagreMedDebounceOgRetry = (constructedState: StateMangement) => {
    if (onLagreBrev) {
      setEndringsstatus((prev) => ({ ...prev, erEndret: true })) // Behold evt. error men sett erEndret=true.
      clearTimeout(debounceLagring.current) // Kanseller pågående timere, enten de var startet på enste linjer eller i retry nedenfor
      debounceLagring.current = setTimeout(async () => {
        setEndringsstatus({ erEndret: true, lagrerNå: true, error: undefined }) // Vis at vi forsøker å lagre
        await onLagreBrev(constructedState)
          .catch((e) => {
            setEndringsstatus({ erEndret: true, lagrerNå: false, error: e.toString() }) // Vis at vi feilet
            if (e?.status === 403) {
              return
            }
            debounceLagring.current = setTimeout(
              () => lagreMedDebounceOgRetry(constructedState), // Try, try again...
              2000
            )
            throw e // Hopp over then blokken under
          })
          .then(() => {
            setEndringsstatus({ erEndret: false, lagrerNå: false, error: undefined })
          })
          .catch(() => {
            /* Ignorer exception... */
          })
      }, 500)
    }
  }

  return { endringsstatus, lagreMedDebounceOgRetry }
}

import { useEffect, useRef, useState } from 'react'
import type { BreveditorState } from './breveditorTyper.ts'

// Interface for å tracke endringsstatus (er alle endringer lagret)
export interface Endringsstatus {
  lagrerNå: boolean
  erEndret: boolean
  error?: string
}

export function useLagreBrev(onLagreBrev?: (state: BreveditorState, serienummer: number) => Promise<void>) {
  const debounceLagring = useRef<ReturnType<typeof setTimeout> | undefined>(undefined)
  const ventendeLagring = useRef<{ state: BreveditorState; serienummer: number } | undefined>(undefined)
  const pågåendeLagring = useRef<Promise<void> | undefined>(undefined)
  const erMontert = useRef(true)
  const [endringsstatus, setEndringsstatus] = useState<Endringsstatus>({
    lagrerNå: false,
    erEndret: false,
  })

  useEffect(() => {
    erMontert.current = true
    return () => {
      erMontert.current = false
      clearTimeout(debounceLagring.current)
    }
  }, [])

  async function flushLagring(): Promise<void> {
    clearTimeout(debounceLagring.current)
    while (pågåendeLagring.current || ventendeLagring.current) {
      if (pågåendeLagring.current) {
        await pågåendeLagring.current
        continue
      }
      const lagring = ventendeLagring.current
      if (!lagring || !onLagreBrev) return
      ventendeLagring.current = undefined
      setEndringsstatus({ erEndret: true, lagrerNå: true, error: undefined })
      const forespørsel = Promise.resolve()
        .then(() => onLagreBrev(lagring.state, lagring.serienummer))
        .catch((error) => {
          if (error?.status === 409) return
          throw error
        })
      pågåendeLagring.current = forespørsel
      try {
        await forespørsel
      } catch (error) {
        ventendeLagring.current ??= lagring
        if (erMontert.current) {
          setEndringsstatus({ erEndret: true, lagrerNå: false, error: String(error) })
          const httpStatus = (error as { status?: number } | undefined)?.status
          if (httpStatus !== 403) {
            planleggLagring(2000)
          }
        }
        throw error
      } finally {
        pågåendeLagring.current = undefined
      }
    }
    clearTimeout(debounceLagring.current)
    if (erMontert.current) {
      setEndringsstatus({ erEndret: false, lagrerNå: false, error: undefined })
    }
  }

  function planleggLagring(forsinkelse: number) {
    clearTimeout(debounceLagring.current)
    debounceLagring.current = setTimeout(() => {
      void flushLagring().catch(() => undefined)
    }, forsinkelse)
  }

  function lagreMedDebounceOgRetry(constructedState: BreveditorState, serienummer: number) {
    if (!onLagreBrev) return
    ventendeLagring.current = { state: constructedState, serienummer }
    setEndringsstatus((prev) => ({ ...prev, erEndret: true }))
    planleggLagring(500)
  }

  return { endringsstatus, lagreMedDebounceOgRetry, flushLagring }
}

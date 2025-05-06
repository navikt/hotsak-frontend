import { useEffect, useState } from 'react'
import { KeyedMutator } from 'swr'
import { oppdaterNotatUtkast, opprettNotatUtkast } from '../../../io/http'
import { NotatKlassifisering, NotatType, NotatUtkast, Saksnotater } from '../../../types/types.internal'

export function useUtkastEndret(
  type: NotatType,
  sakId: string,
  tittel: string,
  tekst: string,
  mutateNotater: KeyedMutator<Saksnotater>,
  aktivtUtkast?: NotatUtkast,
  klassifisering?: NotatKlassifisering | null
) {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const [oppretterNyttUtkast, setOppretterNyttUtkast] = useState(false)
  const [lagrerUtkast, setLagrerUtkast] = useState(false)

  useEffect(() => {
    if (!oppretterNyttUtkast) {
      utkastEndret(tittel, tekst, klassifisering)
    }
  }, [tittel, tekst, klassifisering, oppretterNyttUtkast])

  const utkastEndret = async (tittel: string, tekst: string, klassifisering?: NotatKlassifisering | null) => {
    if (!aktivtUtkast?.id && (tittel !== '' || tekst !== '' || klassifisering)) {
      setLagrerUtkast(true)
      setOppretterNyttUtkast(true)
      await opprettNotatUtkast(sakId, { tittel, tekst, klassifisering, type })
      await mutateNotater()
      setOppretterNyttUtkast(false)
      setLagrerUtkast(false)
    }

    if (debounceTimer) clearTimeout(debounceTimer)
    if (tittel !== '' || tekst !== '' || klassifisering) {
      setDebounceTimer(
        setTimeout(async () => {
          setLagrerUtkast(true)
          const minimumPeriodeVisLagrerUtkast = new Promise((r) => setTimeout(r, 600))

          await oppdaterNotatUtkast(sakId, {
            id: aktivtUtkast?.id,
            tittel,
            tekst,
            klassifisering,
            type,
          })
          mutateNotater()
          await minimumPeriodeVisLagrerUtkast
          setLagrerUtkast(false)
        }, 500)
      )
    }
  }

  return {
    lagrerUtkast,
  }
}

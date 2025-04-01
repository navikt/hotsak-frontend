import { useEffect, useState } from 'react'
import { KeyedMutator } from 'swr'
import { oppdaterNotatUtkast, opprettNotatUtkast } from '../../../io/http'
import { NotatType, NotatUtkast, Saksnotater } from '../../../types/types.internal'

export function useUtkastEndret(
  type: NotatType,
  sakId: string,
  tittel: string,
  tekst: string,
  mutateNotater: KeyedMutator<Saksnotater>,
  aktivtUtkast?: NotatUtkast
) {
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | undefined>(undefined)
  const [oppretterNyttUtkast, setOppretterNyttUtkast] = useState(false)
  const [lagrerUtkast, setLagrerUtkast] = useState(false)

  useEffect(() => {
    if (!oppretterNyttUtkast) {
      utkastEndret(tittel, tekst)
    }
  }, [tittel, tekst, oppretterNyttUtkast])

  const utkastEndret = async (tittel: string, tekst: string) => {
    console.log('aktivtUtkast', aktivtUtkast?.id)
    console.log('opprettet nytt utkast', oppretterNyttUtkast)

    if (!aktivtUtkast?.id && (tittel !== '' || tekst !== '')) {
      setLagrerUtkast(true)
      setOppretterNyttUtkast(true)
      await opprettNotatUtkast(sakId, { tittel, tekst, type })
      await mutateNotater()
      setOppretterNyttUtkast(false)
      setLagrerUtkast(true)
    }

    if (debounceTimer) clearTimeout(debounceTimer)
    if (tittel !== '' || tekst !== '') {
      setDebounceTimer(
        setTimeout(async () => {
          setLagrerUtkast(true)
          const minimumPeriodeVisLagrerUtkast = new Promise((r) => setTimeout(r, 600))

          await oppdaterNotatUtkast(sakId, {
            id: aktivtUtkast?.id,
            tittel,
            tekst,
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

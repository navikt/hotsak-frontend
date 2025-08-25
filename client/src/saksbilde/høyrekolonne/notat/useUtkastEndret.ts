import { useEffect, useState } from 'react'
import { KeyedMutator } from 'swr'

import { useActionState } from '../../../action/Actions.ts'
import { baseUrl, post } from '../../../io/http'
import { http } from '../../../io/HttpClient.ts'
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

  const { execute, state } = useActionState()

  useEffect(() => {
    if (!oppretterNyttUtkast) {
      utkastEndret(tittel, tekst, klassifisering)
    }
  }, [tittel, tekst, klassifisering, oppretterNyttUtkast])

  const opprettNotatUtkast = async (sakId: string, utkast: NotatUtkast) => {
    return execute(async () => {
      await post(`${baseUrl}/api/sak/${sakId}/notater`, utkast)
    })
  }

  const oppdaterNotatUtkast = async (sakId: string, utkast: NotatUtkast) => {
    return execute(async () => {
      if (utkast.id) {
        return http.put(`/api/sak/${sakId}/notater/${utkast.id}`, utkast)
      }
    })
  }

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
          const minimumPeriodeVisLagrerUtkast = new Promise((r) => setTimeout(r, 500))

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
    state,
  }
}

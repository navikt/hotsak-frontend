import { useEffect, useState } from 'react'
import { KeyedMutator, mutate } from 'swr'

import { http } from '../../../io/HttpClient.ts'
import { NotatKlassifisering, NotatType, NotatUtkast, Saksnotater } from '../../../types/types.internal.ts'
import { delay } from '../../../utils/delay.ts'

export function useUtkastEndret(
  type: NotatType,
  sakId: string,
  tittel: string,
  tekst: string,
  mutateNotater: KeyedMutator<Saksnotater>,
  aktivtUtkast?: NotatUtkast,
  klassifisering?: NotatKlassifisering | null
) {
  const [debounceTimer, setDebounceTimer] = useState<ReturnType<typeof setTimeout> | undefined>(undefined)
  const [oppretterNyttUtkast, setOppretterNyttUtkast] = useState(false)
  const [lagrerUtkast, setLagrerUtkast] = useState(false)

  const utkastEndret = async (
    tittel: string,
    tekst: string,
    klassifisering?: NotatKlassifisering | null
  ): Promise<void> => {
    const utkastId = aktivtUtkast?.id
    if (!utkastId && (tittel !== '' || tekst !== '')) {
      setOppretterNyttUtkast(true)
      setLagrerUtkast(true)
      try {
        await http.post(`/api/sak/${sakId}/notater`, { tittel, tekst, klassifisering, type })
        await mutateNotater()
        // TODO usikker på om det gir mening å oppdatere behandling her,er det bedre å sjekke dette på notater enn gjenstående på behandling?
        await mutate(`/api/sak/${sakId}/behandling`)
        await delay(500) // Ikke vis "Lagrer..." kortere enn tid brukt + 500 millisekunder
      } finally {
        setOppretterNyttUtkast(false)
        setLagrerUtkast(false)
      }
      return
    }

    if (debounceTimer) clearTimeout(debounceTimer)
    setDebounceTimer(
      setTimeout(async () => {
        setLagrerUtkast(true)
        try {
          await http.put(`/api/sak/${sakId}/notater/${utkastId}`, {
            id: utkastId,
            tittel,
            tekst,
            klassifisering,
            type,
          })
          await delay(500)
        } finally {
          setLagrerUtkast(false)
        }
      }, 500)
    )
  }

  useEffect(() => {
    if (oppretterNyttUtkast) return // Nytt notat er under opprettelse, ikke gjør noe
    if (tittel !== '' || tekst !== '' || klassifisering) {
      utkastEndret(tittel, tekst, klassifisering)
    }
  }, [tittel, tekst, klassifisering, oppretterNyttUtkast])

  return {
    lagrerUtkast,
  }
}

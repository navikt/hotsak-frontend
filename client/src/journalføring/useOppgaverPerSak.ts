import { useMemo } from 'react'

import { type Oppgave, Oppgavetype, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { useOppgavesøk } from '../oppgave/useOppgavesøk.ts'

export function useOppgaverPerSak(brukerId?: string) {
  const { data, error } = useOppgavesøk(
    brukerId
      ? {
          brukerId,
          statuskategori: Statuskategori.ÅPEN,
          oppgavetype: [Oppgavetype.BEHANDLE_SAK],
          pageNumber: 1,
          pageSize: 1000,
        }
      : undefined,
    { keepPreviousData: false }
  )

  const oppgaverPerSak = useMemo(() => {
    const resultat = new Map<string, Oppgave>()
    for (const oppgave of data?.oppgaver ?? []) {
      if (oppgave.sakId && !resultat.has(oppgave.sakId)) {
        resultat.set(oppgave.sakId, oppgave)
      }
    }
    return resultat
  }, [data])

  return { oppgaverPerSak, oppgaverFeil: error }
}

import { useMemo } from 'react'

import { type Oppgave, Oppgavetype, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { useOppgavesøk } from '../oppgave/useOppgavesøk.ts'

export function useOppgaverPerSak(fodselsnummer?: string) {
  const { data, error } = useOppgavesøk(
    fodselsnummer
      ? {
          brukerId: fodselsnummer,
          statuskategori: Statuskategori.ÅPEN,
          oppgavetype: [Oppgavetype.BEHANDLE_SAK],
          pageSize: 1000,
        }
      : undefined,
    false
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

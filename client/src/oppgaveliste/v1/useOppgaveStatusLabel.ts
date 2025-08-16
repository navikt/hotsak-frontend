import { useMemo } from 'react'

import { Statuskategori } from '../../oppgave/oppgaveTypes.ts'
import { OppgaveStatusLabel, OppgaveStatusType } from '../../types/types.internal.ts'

const avsluttede = [
  OppgaveStatusType.AVSLÅTT,
  OppgaveStatusType.AVVIST,
  OppgaveStatusType.FERDIGSTILT,
  OppgaveStatusType.HENLAGT,
  OppgaveStatusType.INNVILGET,
  OppgaveStatusType.SENDT_GOSYS,
]

export function useOppgaveStatusLabel(statuskategori?: Statuskategori): Map<OppgaveStatusType, string> {
  return useMemo(() => {
    if (!statuskategori) {
      return OppgaveStatusLabel
    }
    if (statuskategori === Statuskategori.ÅPEN) {
      return new Map<OppgaveStatusType, string>([...OppgaveStatusLabel].filter(([key]) => !avsluttede.includes(key)))
    }
    return new Map<OppgaveStatusType, string>(
      [...OppgaveStatusLabel].filter(([key]) => key === OppgaveStatusType.ALLE || avsluttede.includes(key))
    )
  }, [statuskategori])
}

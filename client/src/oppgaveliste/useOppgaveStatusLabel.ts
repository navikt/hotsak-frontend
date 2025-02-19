import { useMemo } from 'react'
import { OppgaveStatusLabel, OppgaveStatusType } from '../types/types.internal.ts'

const ferdigstilte = [
  OppgaveStatusType.AVSLÅTT,
  OppgaveStatusType.AVVIST,
  OppgaveStatusType.FERDIGSTILT,
  OppgaveStatusType.HENLAGT,
  OppgaveStatusType.INNVILGET,
  OppgaveStatusType.SENDT_GOSYS,
]

export function useOppgaveStatusLabel(ferdigstilteToggle: boolean): Map<OppgaveStatusType, string> {
  return useMemo(() => {
    if (ferdigstilteToggle) {
      return OppgaveStatusLabel
    } else {
      return new Map<OppgaveStatusType, string>([...OppgaveStatusLabel].filter(([key]) => !ferdigstilte.includes(key)))
    }
  }, [ferdigstilteToggle])
}

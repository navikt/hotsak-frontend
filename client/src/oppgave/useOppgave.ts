import { useDebugValue } from 'react'
import { useParams } from 'react-router'
import useSwr, { SWRResponse } from 'swr'

import { HttpError } from '../io/HttpError.ts'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { useOptionalOppgaveContext } from './OppgaveContext.ts'
import { OppgaveId, Oppgavestatus, OppgaveV2 } from './oppgaveTypes.ts'

export function useOppgaveId(): OppgaveId | undefined {
  const { oppgaveId: oppgaveIdUrl } = useParams<{ oppgaveId: OppgaveId }>()
  const { oppgaveId: oppgaveIdOppgave } = useOptionalOppgaveContext()
  const oppgaveId = oppgaveIdUrl ?? oppgaveIdOppgave
  useDebugValue(oppgaveId)
  return oppgaveId
}

export interface UseOppgaveResponse extends Omit<SWRResponse<OppgaveV2, HttpError>, 'data'> {
  oppgave?: OppgaveV2
  åpen: boolean
  tildeltInnloggetAnsatt: boolean
}

export function useOppgave(): UseOppgaveResponse {
  const ansatt = useInnloggetAnsatt()
  const oppgaveId = useOppgaveId()
  const { data: oppgave, ...rest } = useSwr<OppgaveV2>(oppgaveId ? `/api/oppgaver-v2/${oppgaveId}` : null)
  return {
    oppgave,
    åpen:
      oppgave?.oppgavestatus !== Oppgavestatus.FERDIGSTILT && oppgave?.oppgavestatus !== Oppgavestatus.FEILREGISTRERT,
    tildeltInnloggetAnsatt: oppgave?.tildeltSaksbehandler?.id === ansatt.id,
    ...rest,
  }
}

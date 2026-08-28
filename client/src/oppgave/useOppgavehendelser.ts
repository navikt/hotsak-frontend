import { useEffect } from 'react'
import { useEventSource } from '../event/useEventSource'
import { useToast } from '../felleskomponenter/toast/useToast'
import { useOppgaveId } from './useOppgave'

export function useOppgavehendelser() {
  const oppgaveId = useOppgaveId()
  const url =
    oppgaveId && window.appSettings.NAIS_CLUSTER_NAME === 'dev-gcp' ? `/api/oppgaver/${oppgaveId}/hendelser` : null
  const { showInfoToast } = useToast()
  const { data } = useEventSource<Oppgavehendelse>({
    url,
    event: oppgavePredicate,
  })
  useEffect(() => {
    if (data) {
      console.debug(data)
      showInfoToast(`Oppgaven er endret: ${data.event}`)
    }
  }, [data, showInfoToast])
}

export interface Oppgavehendelse {
  event: 'oppgaveOpprettet' | 'oppgaveEndret' | 'oppgaveFerdigstilt' | 'oppgaveFeilregistrert'
  id: string
  oppgaveId: string
  versjon: number
  tildeltEnhet?: string
  tildeltSaksbehandler?: string
}

function oppgavePredicate(event: string) {
  return event.startsWith('oppgave')
}

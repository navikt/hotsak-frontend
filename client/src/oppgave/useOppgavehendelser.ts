import { useEffect } from 'react'
import { useEventSource } from '../event/useEventSource'
import { useToast } from '../felleskomponenter/toast/useToast'
import { useOppgaveId } from './useOppgave'

export function useOppgavehendelser() {
  const oppgaveId = useOppgaveId()
  const url =
    oppgaveId && window.appSettings.NAIS_CLUSTER_NAME === 'dev-gcp' ? `/api/oppgaver/${oppgaveId}/hendelser` : null
  const { data } = useEventSource<Oppgavehendelse>({
    url,
    event: oppgavePredicate,
  })
  const { showInfoToast } = useToast()
  useEffect(() => {
    if (data) {
      console.debug(data)
      showInfoToast(`Oppgaven er endret, versjon: ${data.versjon}`)
    }
  }, [data, showInfoToast])
}

export function useOppgavehendelserForEnhet() {
  const url = window.appSettings.NAIS_CLUSTER_NAME === 'dev-gcp' ? `/api/oppgaver/hendelser` : null
  const { data } = useEventSource<Oppgavehendelse>({
    url,
    event: oppgavePredicate,
  })
  const { showInfoToast } = useToast()
  useEffect(() => {
    if (data) {
      console.debug(data)
      showInfoToast(
        `Oppgave ble endret, id: ${data.oppgaveId}, versjon: ${data.versjon}, tildeltSaksbehandler: ${data.tildeltSaksbehandler}`
      )
    }
  }, [data, showInfoToast])
}

export interface Oppgavehendelse {
  oppgaveId: string
  versjon: number
  tildeltEnhet?: string
  tildeltSaksbehandler?: string
}

function oppgavePredicate() {
  return true // tester med alle hendelsestyper
}

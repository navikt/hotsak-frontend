import { GjeldendeOppgave, useOppgaveContext } from './OppgaveContext.ts'
import { erEksternOppgaveId, erInternOppgaveId, erSakOppgaveId, OppgaveId } from './oppgaveId.ts'
import type { NavIdent } from '../state/authentication.ts'
import { baseUrl, del, ifMatchVersjon, post } from '../io/http.ts'

export interface EndreOppgavetildelingRequest {
  oppgaveId?: OppgaveId | null
  /**
   * Angis hvis en spesifikk ansatt skal bli saksbehandler.
   */
  saksbehandlerId?: NavIdent | null
  /**
   * `true` hvis tildelingen skal skje selv om oppgaven allerede er tildelt en annen saksbehandler.
   */
  overtaHvisTildelt?: boolean
}

export interface OppgaveService {
  endreOppgavetildeling(request: Omit<EndreOppgavetildelingRequest, 'oppgaveId'>): Promise<void>
  fjernOppgavetildeling(): Promise<void>
}

/**
 * Opprett `OppgaveService` som er knyttet til `oppgaveId`, `versjon` og `sakId` fra `OppgaveContext` eller `gjeldendeOppgave`.
 */
export function useOppgaveService(gjeldendeOppgave?: GjeldendeOppgave): OppgaveService {
  const {
    oppgaveId = gjeldendeOppgave?.oppgaveId,
    versjon = gjeldendeOppgave?.versjon,
    sakId = gjeldendeOppgave?.sakId,
  } = useOppgaveContext()

  return {
    async endreOppgavetildeling(request) {
      const headers = ifMatchVersjon(versjon)

      if (erInternOppgaveId(oppgaveId) || erEksternOppgaveId(oppgaveId)) {
        await post(`${baseUrl}/api/oppgaver-v2/${oppgaveId}/tildeling`, request, headers)
      }

      if (erSakOppgaveId(oppgaveId)) {
        await post(
          `${baseUrl}/api/sak/${sakId}/tildeling`,
          {
            ...request,
            oppgaveId,
          },
          headers
        )
      }
    },
    async fjernOppgavetildeling() {
      const headers = ifMatchVersjon(versjon)

      if (erInternOppgaveId(oppgaveId) || erEksternOppgaveId(oppgaveId)) {
        await del(`${baseUrl}/api/oppgaver-v2/${oppgaveId}/tildeling`, null, headers)
      }

      if (erSakOppgaveId(oppgaveId)) {
        await del(`${baseUrl}/api/sak/${sakId}/tildeling`, null, headers)
      }
    },
  }
}

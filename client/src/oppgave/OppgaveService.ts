import { GjeldendeOppgave, useOppgaveContext } from './OppgaveContext.ts'
import type { OppgaveId } from './oppgaveId.ts'
import type { NavIdent } from '../tilgang/Ansatt.ts'
import { baseUrl, del, ifMatchVersjon, post } from '../io/http.ts'
import { Service, useServiceState } from '../service/Service.ts'

export interface EndreOppgavetildelingRequest {
  oppgaveId?: OppgaveId | null
  /**
   * Angis hvis en spesifikk ansatt skal bli saksbehandler.
   */
  saksbehandlerId?: NavIdent | null
  melding?: string | null
  /**
   * `true` hvis tildelingen skal skje selv om oppgaven allerede er tildelt en annen saksbehandler.
   */
  overtaHvisTildelt?: boolean
}

export interface OppgaveService extends Service {
  /**
   * Endre tildeling av oppgave/sak. Støtter også overtagelse av oppgave/sak.
   *
   * @param request
   */
  endreOppgavetildeling(request: Omit<EndreOppgavetildelingRequest, 'oppgaveId'>): Promise<void>
  /**
   * Fjern tildeling av oppgave/sak. Setter behandlende saksbehandler til `null`.
   */
  fjernOppgavetildeling(): Promise<void>
}

/**
 * Opprett `OppgaveService` som er knyttet til `oppgaveId`, `versjon` og `sakId` fra `OppgaveContext` eller `gjeldendeOppgave`.
 */
export function useOppgaveService(gjeldendeOppgave?: GjeldendeOppgave): OppgaveService {
  const { oppgaveId = gjeldendeOppgave?.oppgaveId, versjon = gjeldendeOppgave?.versjon } = useOppgaveContext()

  const { execute, state } = useServiceState()

  const headers = ifMatchVersjon(versjon)

  return {
    async endreOppgavetildeling(request) {
      return execute(async () => {
        await post(`${baseUrl}/api/oppgaver-v2/${oppgaveId}/tildeling`, request, headers)
      })
    },

    async fjernOppgavetildeling() {
      return execute(async () => {
        await del(`${baseUrl}/api/oppgaver-v2/${oppgaveId}/tildeling`, null, headers)
      })
    },

    state,
  }
}

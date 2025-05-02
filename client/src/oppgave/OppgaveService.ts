import { GjeldendeOppgave, useOppgaveContext } from './OppgaveContext.ts'
import { erEksternOppgaveId, erInternOppgaveId, erSakOppgaveId, OppgaveId } from './oppgaveId.ts'
import type { NavIdent } from '../state/authentication.ts'
import { baseUrl, del, ifMatchVersjon, post } from '../io/http.ts'
import { Service, useServiceState } from '../service/Service.ts'

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
  const {
    oppgaveId = gjeldendeOppgave?.oppgaveId,
    versjon = gjeldendeOppgave?.versjon,
    sakId = gjeldendeOppgave?.sakId,
  } = useOppgaveContext()

  const { execute, state } = useServiceState()

  const headers = ifMatchVersjon(versjon)

  return {
    async endreOppgavetildeling(request) {
      return execute(async () => {
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
      })
    },

    async fjernOppgavetildeling() {
      return execute(async () => {
        if (erInternOppgaveId(oppgaveId) || erEksternOppgaveId(oppgaveId)) {
          await del(`${baseUrl}/api/oppgaver-v2/${oppgaveId}/tildeling`, null, headers)
        }

        if (erSakOppgaveId(oppgaveId)) {
          await del(`${baseUrl}/api/sak/${sakId}/tildeling`, null, headers)
        }
      })
    },

    state,
  }
}

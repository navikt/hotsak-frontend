import { Actions, useActionState } from '../../../action/Actions.ts'
import { useBrevMetadata } from '../../../brev/useBrevMetadata.ts'
import { http } from '../../../io/HttpClient.ts'
import { useOppgave } from '../../../oppgave/useOppgave.ts'
import { mutateSak } from '../../../saksbilde/mutateSak.ts'
import { Behandlingsutfall } from './behandlingTyper.ts'
import { useBehandling } from './useBehandling.ts'

export interface BehandlingActions extends Actions {
  lagreBehandling(utfall?: Behandlingsutfall): Promise<void>
  ferdigstillBehandling(problemsammendrag: string): Promise<void>
}

export function useBehandlingActions(): BehandlingActions {
  const { oppgave, mutate: mutateOppgave } = useOppgave()
  const { oppgaveId, versjon, sakId } = oppgave ?? {}
  const { gjeldendeBehandling, mutate: mutateBehandling } = useBehandling()
  const { mutate: muteBrevMetadata } = useBrevMetadata()
  const { execute, state } = useActionState()

  const mutateOppgaveOgSak = () => Promise.all([mutateOppgave(), mutateSak(sakId)])

  return {
    async lagreBehandling(utfall?: Behandlingsutfall): Promise<void> {
      if (gjeldendeBehandling) {
        const behandlingId = gjeldendeBehandling.behandlingId
        return execute(async () => {
          await http.put(`/api/sak/${sakId}/behandling/${behandlingId}`, { utfall })
          await mutateBehandling()
        })
      }
      return execute(async () => {
        await http.post(`/api/sak/${sakId}/behandling`, { utfall, oppgaveId })
        await mutateBehandling()
      })
    },
    async ferdigstillBehandling(problemsammendrag: string) {
      console.log('Ferdigstiller behandling for sakId', sakId, 'og behandlingId', gjeldendeBehandling?.behandlingId)
      return execute(async () => {
        await http.post(
          `/api/sak/${sakId}/behandling/${gjeldendeBehandling?.behandlingId}/ferdigstilling`,
          { problemsammendrag },
          { versjon }
        )
        await mutateBehandling()
        console.log('Har mutert behandling', gjeldendeBehandling)

        await mutateOppgaveOgSak()
        await muteBrevMetadata()

        console.log('Har mutert oppgave og sak', oppgave)
      })
    },
    state,
  }
}

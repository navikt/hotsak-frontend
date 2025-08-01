import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'
import { Button } from '@navikt/ds-react'
import { OppgaveBase } from '../oppgaveTypes.ts'
import { useOppgaveActions } from '../useOppgaveActions.ts'

export interface TaOppgaveProps {
  oppgave: OppgaveBase
}

export function TaOppgave(props: TaOppgaveProps) {
  const { oppgave } = props
  const ansatt = useInnloggetAnsatt()
  const { endreOppgavetildeling, state } = useOppgaveActions(oppgave)
  if (!ansatt) {
    return null
  }
  return (
    <Button
      size="xsmall"
      variant="tertiary"
      onClick={async () => {
        await endreOppgavetildeling({
          saksbehandlerId: ansatt.id,
        })
      }}
      name="Ta oppgave"
      disabled={state.loading}
      loading={state.loading}
    >
      Ta oppgave
    </Button>
  )
}

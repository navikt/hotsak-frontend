import { Button } from '@navikt/ds-react'
import { MouseEventHandler } from 'react'
import { useNavigate } from 'react-router'

import { EllipsisCell } from '../felleskomponenter/table/Celle.tsx'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { OppgaveV2 } from './oppgaveTypes.ts'
import { useOppgaveActions } from './useOppgaveActions.ts'

export interface TaOppgaveButtonProps {
  oppgave: OppgaveV2
}

export function TaOppgaveButton(props: TaOppgaveButtonProps) {
  const { oppgave } = props
  const ansatt = useInnloggetAnsatt()
  const { endreOppgavetildeling, state } = useOppgaveActions(oppgave)
  const navigate = useNavigate()

  // todo -> sjekk at ansatt faktisk kan ta oppgaven

  if (!ansatt) {
    return null
  }

  if (oppgave.tildeltSaksbehandler) {
    return <EllipsisCell minLength={15} value={oppgave.tildeltSaksbehandler.navn} />
  }

  const onClick: MouseEventHandler<HTMLButtonElement> = async (event) => {
    event.stopPropagation()
    await endreOppgavetildeling({})
    return navigate(`/oppgave/${oppgave.oppgaveId}`)
  }

  return (
    <Button
      size="xsmall"
      variant="tertiary"
      onClick={onClick}
      name="Ta oppgave"
      disabled={state.loading}
      loading={state.loading}
    >
      Ta oppgave
    </Button>
  )
}

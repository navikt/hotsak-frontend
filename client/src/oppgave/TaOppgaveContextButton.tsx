import { Button } from '@navikt/ds-react'
import { MouseEventHandler } from 'react'

import { EllipsisCell } from '../felleskomponenter/table/Celle.tsx'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { useRequiredOppgaveContext } from './OppgaveContext.ts'
import { useOppgaveActions } from './useOppgaveActions.ts'

export interface TaOppgaveContextButtonProps {
  onAction?(): void | Promise<void>
  children?: string
}

export function TaOppgaveContextButton(props: TaOppgaveContextButtonProps) {
  const { onAction, children = 'Ta oppgave' } = props
  const ansatt = useInnloggetAnsatt()
  const { oppgave } = useRequiredOppgaveContext()
  const { endreOppgavetildeling, state } = useOppgaveActions()

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
    if (onAction) onAction()
  }

  return (
    <Button
      size="small"
      variant="secondary"
      onClick={onClick}
      name={children}
      disabled={state.loading}
      loading={state.loading}
    >
      {children}
    </Button>
  )
}

import { ActionMenu } from '@navikt/ds-react'

import { OppgaveV2 } from './oppgaveTypes.ts'
import { useOppgaveActions } from './useOppgaveActions.ts'
import { useOppgaveregler } from './useOppgaveregler.ts'

export interface OppgaveMenuProps {
  oppgave?: OppgaveV2
  onAction?(): void | Promise<void>
  onSelectOverførOppgaveTilMedarbeider?(): void | Promise<void>
}

export function OppgaveMenu(props: OppgaveMenuProps) {
  const { oppgave, onAction, onSelectOverførOppgaveTilMedarbeider } = props
  const {
    oppgaveErKlarTilBehandling,
    oppgaveErUnderBehandlingAvInnloggetAnsatt,
    oppgaveErUnderBehandlingAvAnnenAnsatt,
  } = useOppgaveregler(oppgave)
  const { endreOppgavetildeling, fjernOppgavetildeling } = useOppgaveActions(oppgave)
  const harSkrivetilgang = true // fixme

  // todo -> fortsett behandling hvis OppgaveStatusType.AVVENTER_DOKUMENTASJON og oppgaveErUnderBehandlingAvInnloggetAnsatt

  if (!oppgave || !harSkrivetilgang) {
    return null
  }

  return (
    <ActionMenu.Group label="Oppgave">
      {oppgaveErUnderBehandlingAvInnloggetAnsatt && (
        <ActionMenu.Item
          onSelect={async (event) => {
            event.stopPropagation()
            await fjernOppgavetildeling()
            if (onAction) return onAction()
          }}
        >
          Fjern tildeling
        </ActionMenu.Item>
      )}
      {oppgaveErUnderBehandlingAvAnnenAnsatt && (
        <ActionMenu.Item
          onSelect={async (event) => {
            event.stopPropagation()
            await endreOppgavetildeling({ overtaHvisTildelt: true })
            if (onAction) return onAction()
          }}
        >
          Overta oppgave
        </ActionMenu.Item>
      )}
      {oppgaveErKlarTilBehandling && (
        <ActionMenu.Item
          onSelect={async (event) => {
            event.stopPropagation()
            await endreOppgavetildeling({ overtaHvisTildelt: true })
            if (onAction) return onAction()
          }}
        >
          Ta oppgave
        </ActionMenu.Item>
      )}
      {oppgaveErUnderBehandlingAvInnloggetAnsatt && onSelectOverførOppgaveTilMedarbeider && (
        <ActionMenu.Item
          onSelect={() => {
            onSelectOverførOppgaveTilMedarbeider()
          }}
        >
          Overfør til medarbeider
        </ActionMenu.Item>
      )}
    </ActionMenu.Group>
  )
}

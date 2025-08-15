import { ActionMenu } from '@navikt/ds-react'
import { OppgaveV2 } from './oppgaveTypes.ts'

import { useOppgaveActions } from './useOppgaveActions.ts'

export interface OppgavemenyProps {
  oppgave?: OppgaveV2
  onAction?(): void | Promise<void>
}

export function Oppgavemeny(props: OppgavemenyProps) {
  const { oppgave, onAction } = props
  const { endreOppgavetildeling, fjernOppgavetildeling } = useOppgaveActions(oppgave)

  // todo -> conditional rendering
  // kanTaOppgave
  // kanOvertaOppgave
  // kanFjerneTildeling

  // todo -> overfør til medarbeider

  return (
    <>
      <ActionMenu.Group label="Oppgave">
        <ActionMenu.Item
          onSelect={async () => {
            await fjernOppgavetildeling()
            if (onAction) return onAction()
          }}
        >
          Fjern tildeling
        </ActionMenu.Item>
        <ActionMenu.Item
          onSelect={async () => {
            await endreOppgavetildeling({ overtaHvisTildelt: true })
            if (onAction) return onAction()
          }}
        >
          Overta oppgave
        </ActionMenu.Item>
        <ActionMenu.Item>Overfør til medarbeider</ActionMenu.Item>
      </ActionMenu.Group>
    </>
  )
}

// {isFetching && <Loader size="xsmall" />}

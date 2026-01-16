import { ActionMenu } from '@navikt/ds-react'

import type { OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { useOppgaveActions } from '../../oppgave/useOppgaveActions.ts'
import { OppgaveMenu } from './OppgaveMenu.tsx'
import { useMutateOppgaver } from './useMutateOppgaver.ts'

export interface MedarbeidersOppgaverMenuProps {
  oppgave: OppgaveV2
}

export function MedarbeidersOppgaverMenu(props: MedarbeidersOppgaverMenuProps) {
  const { oppgave } = props
  const { endreOppgavetildeling } = useOppgaveActions(oppgave)
  const mutateOppgaver = useMutateOppgaver()
  return (
    <OppgaveMenu>
      <ActionMenu.Item
        onSelect={async () => {
          await endreOppgavetildeling({
            overtaHvisTildelt: true,
          })
          await mutateOppgaver()
        }}
      >
        Overta oppgave
      </ActionMenu.Item>
    </OppgaveMenu>
  )
}

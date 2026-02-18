import { ActionMenu } from '@navikt/ds-react'

import { type Oppgave, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveActions } from '../oppgave/useOppgaveActions.ts'
import { OppgaveMenu } from './OppgaveMenu.tsx'
import { useMutateOppgaver } from './useMutateOppgaver.ts'

export interface MineOppgaverMenuProps {
  oppgave: Oppgave
}

export function MineOppgaverMenu(props: MineOppgaverMenuProps) {
  const { oppgave } = props
  const { fjernOppgavetildeling } = useOppgaveActions(oppgave)
  const mutateOppgaver = useMutateOppgaver()
  return (
    <OppgaveMenu>
      <ActionMenu.Item
        disabled={oppgave.statuskategori == Statuskategori.AVSLUTTET}
        onSelect={async () => {
          await fjernOppgavetildeling()
          await mutateOppgaver()
        }}
      >
        Fjern tildeling
      </ActionMenu.Item>
    </OppgaveMenu>
  )
}

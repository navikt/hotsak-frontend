import { ActionMenu } from '@navikt/ds-react'
import { useState } from 'react'

import { EndreMappeDialog } from '../felleskomponenter/EndreMappe.tsx'
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
  const [endreMappeOpen, setEndreMappeOpen] = useState(false)

  return (
    <>
      <OppgaveMenu>
        <ActionMenu.Item
          disabled={oppgave.statuskategori == Statuskategori.AVSLUTTET}
          onSelect={async () => {
            await fjernOppgavetildeling.trigger()
            await mutateOppgaver()
          }}
        >
          Fjern tildeling
        </ActionMenu.Item>
        <ActionMenu.Item
          disabled={oppgave.statuskategori == Statuskategori.AVSLUTTET}
          onSelect={() => setEndreMappeOpen(true)}
        >
          Endre mappe
        </ActionMenu.Item>
      </OppgaveMenu>
      {endreMappeOpen && <EndreMappeDialog oppgave={oppgave} onClose={() => setEndreMappeOpen(false)} />}
    </>
  )
}

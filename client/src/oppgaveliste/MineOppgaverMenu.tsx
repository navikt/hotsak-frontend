import { ActionMenu } from '@navikt/ds-react'
import { useState } from 'react'

import { Eksperiment } from '../felleskomponenter/Eksperiment.tsx'
import { EndreOppgaveModal } from '../oppgave/EndreOppgaveModal.tsx'
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
  const [endreOppgaveOpen, setEndreOppgaveOpen] = useState(false)

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
        <Eksperiment>
          <ActionMenu.Item
            disabled={oppgave.statuskategori == Statuskategori.AVSLUTTET}
            onSelect={() => setEndreOppgaveOpen(true)}
          >
            Endre oppgaven
          </ActionMenu.Item>
        </Eksperiment>
      </OppgaveMenu>
      {endreOppgaveOpen && <EndreOppgaveModal oppgave={oppgave} onClose={() => setEndreOppgaveOpen(false)} />}
    </>
  )
}

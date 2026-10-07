import { ActionMenu } from '@navikt/ds-react'
import { useState } from 'react'
import { EndreMappeDialog } from '../felleskomponenter/EndreMappe.tsx'

import { type Oppgave, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { OppgaveMenu } from './OppgaveMenu.tsx'

export interface EnhetensOppgaverMenuProps {
  oppgave: Oppgave
}

export function EnhetensOppgaverMenu(props: EnhetensOppgaverMenuProps) {
  const { oppgave } = props
  const [endreMappeOpen, setEndreMappeOpen] = useState(false)

  return (
    <>
      <OppgaveMenu>
        <ActionMenu.Item
          disabled={oppgave.statuskategori == Statuskategori.AVSLUTTET}
          onSelect={() => {
            setEndreMappeOpen(true)
          }}
        >
          Endre mappe
        </ActionMenu.Item>
      </OppgaveMenu>
      {endreMappeOpen && <EndreMappeDialog oppgave={oppgave} onClose={() => setEndreMappeOpen(false)} />}
    </>
  )
}

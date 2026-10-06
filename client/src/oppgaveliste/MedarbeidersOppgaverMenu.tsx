import { ActionMenu } from '@navikt/ds-react'
import { useState } from 'react'
import { EndreMappeDialog } from '../felleskomponenter/EndreMappe.tsx'

import { type Oppgave, Statuskategori } from '../oppgave/oppgaveTypes.ts'
import { OppgaveMenu } from './OppgaveMenu.tsx'
import { useMiljø } from '../utils/useMiljø.ts'

export interface MedarbeidersOppgaverMenuProps {
  oppgave: Oppgave
}

export function MedarbeidersOppgaverMenu(props: MedarbeidersOppgaverMenuProps) {
  const { erProd } = useMiljø()
  const { oppgave } = props
  const [endreMappeOpen, setEndreMappeOpen] = useState(false)
  if (erProd) {
    return null
  }

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

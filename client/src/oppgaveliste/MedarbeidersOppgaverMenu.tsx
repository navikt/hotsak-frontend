import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { OppgaveMenu } from './OppgaveMenu.tsx'

export interface MedarbeidersOppgaverMenuProps {
  oppgave: Oppgave
}

export function MedarbeidersOppgaverMenu(/* props: MedarbeidersOppgaverMenuProps */) {
  // const { oppgave } = props
  return (
    <>
      <OppgaveMenu>
        <></>
      </OppgaveMenu>
    </>
  )
}

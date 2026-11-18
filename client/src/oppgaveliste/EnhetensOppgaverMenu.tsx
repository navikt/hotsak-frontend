import { type Oppgave } from '../oppgave/oppgaveTypes.ts'
import { OppgaveMenu } from './OppgaveMenu.tsx'

export interface EnhetensOppgaverMenuProps {
  oppgave: Oppgave
}

export function EnhetensOppgaverMenu(/* props: EnhetensOppgaverMenuProps */) {
  // const { oppgave } = props
  return (
    <>
      <OppgaveMenu>
        <></>
      </OppgaveMenu>
    </>
  )
}

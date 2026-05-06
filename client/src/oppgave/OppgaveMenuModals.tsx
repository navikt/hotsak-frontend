import { EndreGjelderModal } from './EndreGjelderModal.tsx'
import { FortsettBehandlingModal } from './FortsettBehandlingModal.tsx'
import { type Oppgave } from './oppgaveTypes.ts'
import { OverførTilMedarbeiderModal } from './OverførTilMedarbeiderModal.tsx'
import { SettPåVentModal } from './SettPåVentModal.tsx'

export interface OppgaveMenuModalsProps {
  oppgave: Oppgave
}

export function OppgaveMenuModals(props: OppgaveMenuModalsProps) {
  const { oppgave } = props
  return (
    <>
      <SettPåVentModal oppgave={oppgave} />
      <FortsettBehandlingModal oppgave={oppgave} />
      <EndreGjelderModal oppgave={oppgave} />
      <OverførTilMedarbeiderModal oppgave={oppgave} />
    </>
  )
}

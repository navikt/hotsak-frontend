import { KommentarForm } from '../../oppgave/kommentar/KommentarForm'
import type { Saksbehandlingsoppgave } from '../../oppgave/oppgaveTypes'
import { ForvaltningsnotatForm } from './ForvaltningsnotatForm'
import { NotatType, type Notat } from './notatTyper'

export interface OpprettNotatProps {
  type: NotatType
  oppgave: Saksbehandlingsoppgave
  aktivtUtkast?: Notat
}

export function OpprettNotat(props: OpprettNotatProps) {
  const { type, oppgave, aktivtUtkast } = props

  const sakId = oppgave.sakId
  const lesevisning = false

  switch (type) {
    case NotatType.KOMMENTAR:
      return <KommentarForm oppgave={oppgave} />
    case NotatType.JOURNALFØRT:
      return <ForvaltningsnotatForm sakId={sakId} lesevisning={lesevisning} aktivtUtkast={aktivtUtkast} />
    default:
      return null
  }
}

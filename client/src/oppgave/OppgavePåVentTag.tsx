import { Tag } from '@navikt/ds-react'

import { type Oppgave } from './oppgaveTypes.ts'
import { formaterDato } from '../utils/dato.ts'

export interface OppgavePåVentTagProps {
  oppgave: Oppgave
}

export function OppgavePåVentTag(props: OppgavePåVentTagProps) {
  const { oppgave } = props
  if (!oppgave.isPåVent) {
    return null
  }
  return (
    <Tag data-color="neutral" variant="moderate" size="small">
      {`På vent til ${formaterDato(oppgave.aktivDato)}`}
    </Tag>
  )
}

import { Tag, type TagProps } from '@navikt/ds-react'

import { type Oppgave } from './oppgaveTypes.ts'
import { formaterDato } from '../utils/dato.ts'

export interface OppgavePåVentTagProps extends Omit<TagProps, 'children'> {
  oppgave: Oppgave
}

export function OppgavePåVentTag(props: OppgavePåVentTagProps) {
  const { oppgave, ...rest } = props
  if (!oppgave.isPåVent) {
    return null
  }
  return (
    <Tag size="small" data-color="neutral" variant="moderate" {...rest}>
      {`På vent til ${formaterDato(oppgave.aktivDato)}`}
    </Tag>
  )
}

import { BodyShort, type BodyShortProps } from '@navikt/ds-react'
import { useMemo } from 'react'

import type { Personnavn } from '../../types/hotlibs.ts'
import { formaterNavn } from '../../utils/formater.ts'

export interface FormatPersonnavnProps extends Omit<BodyShortProps, 'children'> {
  value?: Personnavn
}

export function FormatPersonnavn(props: FormatPersonnavnProps) {
  const { value, ...rest } = props
  const formatted = useMemo(() => formaterNavn(value), [value])
  if (!formatted) return null
  return <BodyShort {...rest}>{formatted}</BodyShort>
}

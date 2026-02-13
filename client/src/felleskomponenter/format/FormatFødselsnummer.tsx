import { BodyShort, type BodyShortProps } from '@navikt/ds-react'
import { useMemo } from 'react'

import { formaterFødselsnummer } from '../../utils/formater.ts'

export interface FormatFødselsnummerProps extends Omit<BodyShortProps, 'children'> {
  value?: string
}

export function FormatFødselsnummer(props: FormatFødselsnummerProps) {
  const { value, ...rest } = props
  const formatted = useMemo(() => formaterFødselsnummer(value), [value])
  if (!formatted) return null
  return <BodyShort {...rest}>{formatted}</BodyShort>
}

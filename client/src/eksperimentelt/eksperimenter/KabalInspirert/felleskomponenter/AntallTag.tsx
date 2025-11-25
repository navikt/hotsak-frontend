import { Tag } from '@navikt/ds-react'

export function AntallTag({ antall }: { antall: number }) {
  return (
    <Tag size="xsmall" variant={antall > 1 ? 'warning-moderate' : 'info-moderate'}>
      {`${antall} stk`}
    </Tag>
  )
}

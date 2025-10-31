import { Tag } from '@navikt/ds-react'

export function AntallTag({ antall }: { antall: number }) {
  return (
    <Tag size="small" variant={antall > 1 ? 'warning' : 'neutral'}>
      {`${antall} stk`}
    </Tag>
  )
}

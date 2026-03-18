import { Tag } from '@navikt/ds-react'

export function AntallTag({ antall }: { antall: number }) {
  return (
    <Tag size="small" data-color={antall > 1 ? 'warning' : 'neutral'} variant="moderate">
      {`${antall} stk`}
    </Tag>
  )
}

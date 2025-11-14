import { Tag } from '@navikt/ds-react'
import { Tekst } from '../../../../felleskomponenter/typografi'

export function AntallTag({ antall }: { antall: number }) {
  if (antall === 1) {
    return <Tekst>{`${antall} stk`}</Tekst>
  }
  return (
    <Tag size="xsmall" variant={'warning-moderate'}>
      {`${antall} stk`}
    </Tag>
  )
}

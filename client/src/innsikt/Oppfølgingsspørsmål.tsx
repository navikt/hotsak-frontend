import type { IOppfølgingsspørsmål } from './spørreundersøkelser'
import { Spørsmål } from './Spørsmål'
import { Box } from '@navikt/ds-react'

export interface OppfølgingsspørsmålProp {
  spørsmål: IOppfølgingsspørsmål
  navn?: string
  nivå?: number
}

export function Oppfølgingsspørsmål(props: OppfølgingsspørsmålProp) {
  const { spørsmål, navn, nivå = 0 } = props
  return (
    <Box
      background="surface-action-subtle"
      padding={nivå > 1 ? '0' : '3'}
      style={{
        marginTop: nivå > 1 ? 'var(--a-spacing-3)' : 0,
      }}
    >
      <Spørsmål spørsmål={spørsmål.spørsmål} navn={navn} nivå={nivå} />
    </Box>
  )
}

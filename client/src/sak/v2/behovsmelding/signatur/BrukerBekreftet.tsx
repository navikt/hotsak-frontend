import { Box } from '@navikt/ds-react'
import { Tekst, TextContainer } from '../../../../felleskomponenter/typografi'

interface BrukerBekreftetProps {
  navn: string
}

export function BrukerBekreftet({ navn }: BrukerBekreftetProps) {
  return (
    <Box paddingInline={'space-12 space-8'} paddingBlock="space-8">
      <TextContainer>
        <Tekst>{`${navn} har godkjent søknaden selv på nav.no`}</Tekst>
      </TextContainer>
    </Box>
  )
}

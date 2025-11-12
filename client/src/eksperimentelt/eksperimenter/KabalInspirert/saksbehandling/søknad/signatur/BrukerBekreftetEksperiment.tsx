import { Heading } from '@navikt/ds-react'
import { Brødtekst, TextContainer } from '../../../../../../felleskomponenter/typografi'

interface BrukerBekreftetEksperimentProps {
  navn: string
}

export function BrukerBekreftetEksperiment({ navn }: BrukerBekreftetEksperimentProps) {
  return (
    <TextContainer>
      <Heading level="2" size="small" spacing={true}>
        Bruker har godkjent søknaden
      </Heading>
      <Brødtekst>{`${navn} har godkjent søknaden selv på nav.no`}</Brødtekst>
    </TextContainer>
  )
}

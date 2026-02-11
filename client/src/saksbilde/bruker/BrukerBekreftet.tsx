import { Heading } from '@navikt/ds-react'

import { Brødtekst, TextContainer } from '../../felleskomponenter/typografi'
import { HeadingProps } from './Signatur'

interface BrukerBekreftetProps extends HeadingProps {
  navn: string
}

export function BrukerBekreftet({ navn, headingLevel }: BrukerBekreftetProps) {
  return (
    <TextContainer>
      <Heading level={headingLevel} size="small" spacing={true}>
        Bruker har godkjent søknaden
      </Heading>
      <Brødtekst>{`${navn} har godkjent søknaden selv på nav.no`}</Brødtekst>
    </TextContainer>
  )
}

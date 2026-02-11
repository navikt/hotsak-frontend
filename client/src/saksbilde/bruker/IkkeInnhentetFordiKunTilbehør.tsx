import { Heading, List } from '@navikt/ds-react'
import { TextContainer } from '../../felleskomponenter/typografi'
import { HeadingProps } from './Signatur'

export function IkkkeInnhentetFordiKunTilbehør({ headingLevel }: HeadingProps) {
  return (
    <TextContainer>
      <Heading level={headingLevel} size="small" spacing={true}>
        Fullmakt
      </Heading>
      <List as="ul" size="small">
        <List.Item>
          Det er ikke innhentet fullmakt i denne saken, da Nav i en tidsbegrenset periode ønsker mer kunnskap om hvorfor
          det meldes behov for tilbehør i etterkant av en søknad/vedtak om hjelpemiddel.
        </List.Item>
      </List>
    </TextContainer>
  )
}

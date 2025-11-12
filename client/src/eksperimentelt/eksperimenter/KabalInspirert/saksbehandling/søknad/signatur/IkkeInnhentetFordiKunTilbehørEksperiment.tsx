import { Heading, List } from '@navikt/ds-react'
import { TextContainer } from '../../../../../../felleskomponenter/typografi'

export function IkkkeInnhentetFordiKunTilbehørEksperiment() {
  return (
    <TextContainer>
      <Heading level="2" size="small" spacing={true}>
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

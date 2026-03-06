import { Box } from '@navikt/ds-react'
import { Tekst, TextContainer } from '../../../../felleskomponenter/typografi'

export function IkkkeInnhentetFordiKunTilbehør() {
  return (
    <Box paddingInline={'space-12 space-8'} paddingBlock="space-8">
      <TextContainer>
        <Tekst>
          Det er ikke innhentet fullmakt i denne saken, da Nav i en tidsbegrenset periode ønsker mer kunnskap om hvorfor
          det meldes behov for tilbehør i etterkant av en søknad/vedtak om hjelpemiddel.
        </Tekst>
      </TextContainer>
    </Box>
  )
}

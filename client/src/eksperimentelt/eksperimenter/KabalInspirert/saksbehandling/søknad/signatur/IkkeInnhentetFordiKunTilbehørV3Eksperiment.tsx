import { Heading, List } from '@navikt/ds-react'
import { TextContainer } from '../../../../../../felleskomponenter/typografi'

export function IkkkeInnhentetFordiKunTilbehørV3Eksperiment() {
  return (
    <TextContainer>
      <Heading level="2" size="small" spacing={true}>
        Fullmakt
      </Heading>
      <List as="ul" size="small">
        <List.Item>
          Formidler må ikke innhente fullmakt for å melde behov om tilbehøret. Nav går ut fra at fullmakt ble hentet inn
          da det ble meldt behov om hjelpemiddelet tilbehøret skal brukes sammen med.
        </List.Item>
        <List.Item>
          Formidler bekrefter at innbygger har vært involvert og er enig i at formidler melder behov for tilbehøret.
          Innbygger er kjent med hvilket tilbehør formidler søker om.
        </List.Item>
      </List>
    </TextContainer>
  )
}

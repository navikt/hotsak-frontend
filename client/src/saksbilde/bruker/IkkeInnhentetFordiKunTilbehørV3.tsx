import { Heading, List } from '@navikt/ds-react'
import { TextContainer } from '../../felleskomponenter/typografi'
import { HeadingProps } from './Signatur'

export function IkkkeInnhentetFordiKunTilbehørV3({ headingLevel }: HeadingProps) {
  return (
    <TextContainer>
      <Heading level={headingLevel} size="small" spacing={true}>
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

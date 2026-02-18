import { Heading, List, Box } from '@navikt/ds-react'
import { TextContainer } from '../../felleskomponenter/typografi'
import { HeadingProps } from './Signatur'

export function IkkkeInnhentetFordiKunTilbehørV2({ headingLevel }: HeadingProps) {
  return (
    <TextContainer>
      <Heading level={headingLevel} size="small" spacing={true}>
        Fullmakt
      </Heading>
      <Box marginBlock="space-12" asChild>
        <List data-aksel-migrated-v8 as="ul" size="small">
          <List.Item>
            Formidler må ikke innhente fullmakt for å melde behov om tilbehøret. Nav går ut fra at fullmakt ble hentet
            inn da det ble meldt behov om hjelpemiddelet tilbehøret skal brukes sammen med.
          </List.Item>
          <List.Item>
            Formidler bekrefter at innbygger ønsker at hen melder behov for tilbehøret. Innbygger er kjent med hvilket
            tilbehør formidler melder behov om.
          </List.Item>
        </List>
      </Box>
    </TextContainer>
  )
}

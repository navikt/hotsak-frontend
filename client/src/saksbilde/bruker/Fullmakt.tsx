import { Heading, List, Box } from '@navikt/ds-react'
import { TextContainer } from '../../felleskomponenter/typografi'
import { HeadingProps } from './Signatur'

interface FullmaktProps extends HeadingProps {
  navn: string
}

export function Fullmakt({ navn, headingLevel }: FullmaktProps) {
  return (
    <TextContainer>
      <Heading level={headingLevel} size="small" spacing={true}>
        Fullmakt
      </Heading>
      <Box marginBlock="space-12" asChild>
        <List data-aksel-migrated-v8 as="ul" size="small">
          <List.Item>
            {`${navn} har signert en fullmakt på at formidler fyller ut og begrunner søknad om hjelpemidler på sine vegne. ${navn} er kjent med hvilke hjelpemidler det søkes om og er informert om sine rettigheter og plikter.`}
          </List.Item>
          <List.Item>
            Fullmakten er arkivert i kommunens arkiv og kan vises frem på forespørsel fra Nav Hjelpemiddelsentral.
          </List.Item>
        </List>
      </Box>
    </TextContainer>
  )
}

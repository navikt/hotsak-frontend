import { Box, List } from '@navikt/ds-react'
import { TextContainer } from '../../../../felleskomponenter/typografi'

interface FullmaktProps {
  navn: string
}

export function Fullmakt({ navn }: FullmaktProps) {
  return (
    <Box paddingInline={'space-12 space-8'} paddingBlock="space-8">
      <TextContainer>
        <List as="ul" size="small">
          <List.Item>
            {`${navn} har signert en fullmakt på at formidler fyller ut og begrunner søknad om hjelpemidler på sine vegne. ${navn} er kjent med hvilke hjelpemidler det søkes om og er informert om sine rettigheter og plikter.`}
          </List.Item>
          <List.Item>
            Fullmakten er arkivert i kommunens arkiv og kan vises frem på forespørsel fra Nav Hjelpemiddelsentral.
          </List.Item>
        </List>
      </TextContainer>
    </Box>
  )
}

import { Box, List } from '@navikt/ds-react'
import { TextContainer } from '../../../../felleskomponenter/typografi'

interface FullmaktFritakProps {
  navn: string
}

export function FullmaktFritak({ navn }: FullmaktFritakProps) {
  return (
    <Box paddingInline={'space-12 space-8'} paddingBlock="space-8">
      <TextContainer>
        <List data-aksel-migrated-v8 as="ul" size="small">
          <List.Item>Fullmakt på papir er ikke innhentet på grunn av korona-situasjonen</List.Item>
          <List.Item>
            {`${navn} er kjent med hvilke hjelpemidler det søkes om, er informert om sine rettigheter og plikter, og om at Nav kan innhente nødvendige opplysninger for å behandle søknaden.`}{' '}
          </List.Item>
        </List>
      </TextContainer>
    </Box>
  )
}

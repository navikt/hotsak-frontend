import { Heading, List } from '@navikt/ds-react'
import { TextContainer } from '../../../../felleskomponenter/typografi'

interface FullmaktFritakEksperimentProps {
  navn: string
}

export function FullmaktFritakEksperiment({ navn }: FullmaktFritakEksperimentProps) {
  return (
    <TextContainer>
      <Heading level="2" size="small" spacing={true}>
        Fullmakt med fritak for signatur
      </Heading>
      <List as="ul" size="small">
        <List.Item>Fullmakt på papir er ikke innhentet på grunn av korona-situasjonen</List.Item>
        <List.Item>
          {`${navn} er kjent med hvilke hjelpemidler det søkes om, er informert om sine rettigheter og plikter, og om at Nav kan innhente nødvendige opplysninger for å behandle søknaden.`}{' '}
        </List.Item>
      </List>
    </TextContainer>
  )
}

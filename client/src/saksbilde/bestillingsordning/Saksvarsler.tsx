import { Box, InfoCard, List } from '@navikt/ds-react'
import { TextContainer } from '../../felleskomponenter/typografi'
import { Varsel } from '../../types/types.internal'

export function Saksvarsler({ varsler }: { varsler: Varsel[] }) {
  return varsler.map((varsel) => (
    <Box paddingBlock="space-0 space-16">
      <InfoCard data-color="info" size="small">
        <InfoCard.Header>
          <InfoCard.Title>{varsel.tittel}</InfoCard.Title>
        </InfoCard.Header>
        <TextContainer>
          <InfoCard.Content>
            <List data-aksel-migrated-v8 size="small" as="ul">
              {varsel.beskrivelse.map((beskrivelse) => (
                <List.Item key={beskrivelse}>{beskrivelse}</List.Item>
              ))}
            </List>
          </InfoCard.Content>
        </TextContainer>
      </InfoCard>
    </Box>
  ))
}

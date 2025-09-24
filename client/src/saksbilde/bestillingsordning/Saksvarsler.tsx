import { Heading, List } from '@navikt/ds-react'
import { SystemAlert } from '../../felleskomponenter/SystemAlert'
import { Varsel } from '../../types/types.internal'

export function Saksvarsler({ varsler }: { varsler: Varsel[] }) {
  return varsler.map((varsel) => (
    <SystemAlert key={varsel.tittel} variant="info">
      <Heading level="2" size="xsmall" spacing>
        {varsel.tittel}
      </Heading>
      <List size="small" as="ul">
        {varsel.beskrivelse.map((beskrivelse) => (
          <List.Item key={beskrivelse}>{beskrivelse}</List.Item>
        ))}
      </List>
    </SystemAlert>
  ))
}

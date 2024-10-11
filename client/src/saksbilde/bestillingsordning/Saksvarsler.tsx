import { List } from '@navikt/ds-react'
import { SystemAlert } from '../../felleskomponenter/SystemAlert'
import { Varsel } from '../../types/types.internal'

export function Saksvarsler({ varsler }: { varsler: Varsel[] }) {
  return varsler.map((varsel) => (
    <SystemAlert key={varsel.tittel}>
      <List size="small" as="ul" title={varsel.tittel}>
        {varsel.beskrivelse.map((beskrivelse) => (
          <List.Item key={beskrivelse}>{beskrivelse}</List.Item>
        ))}
      </List>
    </SystemAlert>
  ))
}

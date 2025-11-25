import { List } from '@navikt/ds-react'
import { SystemAlert } from '../../felleskomponenter/SystemAlert'
import { Brødtekst } from '../../felleskomponenter/typografi'
import { Varsel } from '../../types/types.internal'

export function Saksvarsler({ varsler }: { varsler: Varsel[] }) {
  return varsler.map((varsel) => (
    <SystemAlert key={varsel.tittel} variant="info">
      <Brødtekst>{varsel.tittel}</Brødtekst>
      <List size="small" as="ul">
        {varsel.beskrivelse.map((beskrivelse) => (
          <List.Item key={beskrivelse}>{beskrivelse}</List.Item>
        ))}
      </List>
    </SystemAlert>
  ))
}

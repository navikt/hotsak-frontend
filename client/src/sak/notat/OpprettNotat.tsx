import { VStack } from '@navikt/ds-react/Stack'
import { ToggleGroup } from '@navikt/ds-react/ToggleGroup'
import { useState } from 'react'

import { KommentarForm } from '../../oppgave/kommentar/KommentarForm'
import type { Saksbehandlingsoppgave } from '../../oppgave/oppgaveTypes'
import { ForvaltningsnotatForm } from './ForvaltningsnotatForm'
import { NotatType, type Notat } from './notatTyper'

export interface OpprettNotatProps {
  oppgave: Saksbehandlingsoppgave
  aktivtUtkast?: Notat
}

export function OpprettNotat(props: OpprettNotatProps) {
  const { oppgave, aktivtUtkast } = props
  const [type, setType] = useState<NotatType | string>(NotatType.KOMMENTAR)

  return (
    <VStack gap="space-16">
      <ToggleGroup size="small" value={type} label="Opprett nytt notat" onChange={setType}>
        <ToggleGroup.Item value={NotatType.KOMMENTAR} label="Kommentar" />
        <ToggleGroup.Item value={NotatType.JOURNALFØRT} label="Forvaltningsnotat" />
      </ToggleGroup>
      {type === NotatType.KOMMENTAR && <KommentarForm oppgave={oppgave} />}
      {type === NotatType.JOURNALFØRT && <ForvaltningsnotatForm sakId={oppgave.sakId} aktivtUtkast={aktivtUtkast} />}
    </VStack>
  )
}

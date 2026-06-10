import { Button, ToggleGroup, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { type SWRMutationResponse } from 'swr/mutation'

import { Målform } from '../../brev/brevTyper'
import { type HttpError } from '../../io/HttpError'
import { KommentarForm } from '../../oppgave/kommentar/KommentarForm'
import { type Saksbehandlingsoppgave } from '../../oppgave/oppgaveTypes'
import { ForvaltningsnotatForm } from './ForvaltningsnotatForm'
import { NotatType, type Notat, type OpprettNotatRequest } from './notatTyper'

export interface OpprettNotatProps {
  oppgave: Saksbehandlingsoppgave
  opprettNotat: SWRMutationResponse<Notat, HttpError, string | null, OpprettNotatRequest>
  gjeldendeUtkast?: Notat
}

export function OpprettNotat(props: OpprettNotatProps) {
  const { oppgave, opprettNotat, gjeldendeUtkast } = props
  const [type, setType] = useState<NotatType | string>(NotatType.KOMMENTAR)

  const handleOpprettNotat = async () => {
    await opprettNotat.trigger(defaultNotatRequest)
  }

  return (
    <VStack gap="space-16">
      <ToggleGroup size="small" value={type} label="Opprett nytt notat" onChange={setType}>
        <ToggleGroup.Item value={NotatType.KOMMENTAR} label="Kommentar" />
        <ToggleGroup.Item value={NotatType.JOURNALFØRT} label="Forvaltningsnotat" />
      </ToggleGroup>
      {type === NotatType.KOMMENTAR && <KommentarForm oppgave={oppgave} />}
      {type === NotatType.JOURNALFØRT && (
        <>
          {!gjeldendeUtkast && (
            <div>
              <Button size="small" loading={opprettNotat.isMutating} onClick={handleOpprettNotat}>
                Opprett forvaltningsnotat
              </Button>
            </div>
          )}
          {gjeldendeUtkast && <ForvaltningsnotatForm sakId={oppgave.sakId} gjeldendeUtkast={gjeldendeUtkast} />}
        </>
      )}
    </VStack>
  )
}

const defaultNotatRequest: OpprettNotatRequest = {
  type: NotatType.JOURNALFØRT,
  tittel: '',
  tekst: '',
  målform: Målform.BOKMÅL,
  klassifisering: null,
}

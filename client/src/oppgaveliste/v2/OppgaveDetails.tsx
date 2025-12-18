import { BodyShort, HStack, Link, VStack } from '@navikt/ds-react'

import { Strek } from '../../felleskomponenter/Strek.tsx'
import { oppgaveIdUtenPrefix, type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { Sakstype } from '../../types/types.internal.ts'
import { formaterFødselsnummer, formaterNavn } from '../../utils/formater.ts'
import { OppgaveDetailsItem } from './OppgaveDetailsItem.tsx'
import { OppgaveHjelpemidler } from './OppgaveHjelpemidler.tsx'
import { OppgaveSisteKommentar } from './OppgaveSisteKommentar.tsx'
import { useMiljø } from '../../utils/useMiljø.ts'

export interface OppgaveDetailsProps {
  oppgave: OppgaveV2
  visible?: boolean
}

export function OppgaveDetails({ oppgave, visible }: OppgaveDetailsProps) {
  const oppgaveId = oppgaveIdUtenPrefix(oppgave.oppgaveId)
  const bruker = oppgave.bruker
  const sak = oppgave.sak
  const oppgaveUrl = useOppgaveUrl(oppgaveId)
  return (
    <VStack gap="5">
      <VStack gap="3">
        {bruker && (
          <OppgaveDetailsItem label="Bruker">
            <HStack gap="3">
              <BodyShort size="small">{formaterNavn(bruker.navn)}</BodyShort>
              <BodyShort size="small">{formaterFødselsnummer(bruker.fnr)}</BodyShort>
              {bruker.brukernummer && <BodyShort size="small">{bruker.brukernummer}</BodyShort>}
            </HStack>
          </OppgaveDetailsItem>
        )}
        {sak?.søknadGjelder && <OppgaveDetailsItem label="Beskrivelse" value={sak?.søknadGjelder} />}
        {sak?.sakstype !== Sakstype.BARNEBRILLER && <OppgaveHjelpemidler sakId={visible ? oppgave.sakId : null} />}
        <OppgaveSisteKommentar oppgaveId={visible ? oppgave.oppgaveId : null} />
        <div>
          <Strek />
          <BodyShort as={Link} href={oppgaveUrl} size="small" target="_blank" variant="subtle" spacing>
            Åpne i Gosys
          </BodyShort>
        </div>
      </VStack>
    </VStack>
  )
}

function useOppgaveUrl(oppgaveId: string) {
  const { erProd } = useMiljø()
  let host: string
  if (erProd) {
    host = 'gosys.intern.nav.no'
  } else {
    host = 'gosys-q2.dev.intern.nav.no'
  }
  return `https://${host}/gosys/oppgavebehandling/oppgave/${oppgaveId}`
}

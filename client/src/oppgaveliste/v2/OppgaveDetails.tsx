import { BodyShort, HStack, Link, VStack } from '@navikt/ds-react'

import { Eksperiment } from '../../felleskomponenter/Eksperiment.tsx'
import { Strek } from '../../felleskomponenter/Strek.tsx'
import { oppgaveIdUtenPrefix, type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { Sakstype } from '../../types/types.internal.ts'
import { formaterNavn } from '../../utils/formater.ts'
import { OppgaveDetailsItem } from './OppgaveDetailsItem.tsx'
import { OppgaveHjelpemidler } from './OppgaveHjelpemidler.tsx'
import { OppgaveSisteKommentar } from './OppgaveSisteKommentar.tsx'

export interface OppgaveDetailsProps {
  oppgave: OppgaveV2
  visible?: boolean
}

export function OppgaveDetails({ oppgave, visible }: OppgaveDetailsProps) {
  const oppgaveId = oppgaveIdUtenPrefix(oppgave.oppgaveId)
  return (
    <VStack gap="5">
      <VStack gap="3">
        {oppgave.bruker && (
          <OppgaveDetailsItem label="Bruker">
            <HStack gap="3">
              <BodyShort size="small">{formaterNavn(oppgave.bruker.navn)}</BodyShort>
              <BodyShort size="small">{oppgave.bruker.fnr}</BodyShort>
              {oppgave.bruker.brukernummer && <BodyShort size="small">{oppgave.bruker.brukernummer}</BodyShort>}
            </HStack>
          </OppgaveDetailsItem>
        )}
        {oppgave.sak?.søknadGjelder && <OppgaveDetailsItem label="Beskrivelse" value={oppgave.sak?.søknadGjelder} />}
        {oppgave.sak?.sakstype !== Sakstype.BARNEBRILLER && (
          <OppgaveHjelpemidler sakId={visible ? oppgave.sakId : null} />
        )}
        <OppgaveSisteKommentar oppgaveId={visible ? oppgave.oppgaveId : null} />
      </VStack>
      <Eksperiment>
        <div>
          <Strek />
          <VStack gap="3">
            <OppgaveDetailsItem label="OppgaveID">
              <BodyShort
                as={Link}
                href={`https://gosys-q2.dev.intern.nav.no/gosys/oppgavebehandling/oppgave/${oppgaveId}`}
                size="small"
                target="_blank"
                variant="subtle"
              >
                {oppgaveId}
              </BodyShort>
            </OppgaveDetailsItem>
            <OppgaveDetailsItem label="JournalpostID" value={oppgave.journalpostId} />
            <OppgaveDetailsItem label="Saksnummer" value={oppgave.sakId} />
          </VStack>
        </div>
      </Eksperiment>
    </VStack>
  )
}

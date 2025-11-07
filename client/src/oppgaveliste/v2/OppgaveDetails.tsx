import { InformationSquareIcon } from '@navikt/aksel-icons'
import { BodyShort, Detail, HStack, Label, Link, VStack } from '@navikt/ds-react'
import { isValidElement, type ReactNode } from 'react'

import { Eksperiment } from '../../felleskomponenter/Eksperiment.tsx'
import { FormatertTidspunkt } from '../../felleskomponenter/format/FormatertTidspunkt.tsx'
import { Strek } from '../../felleskomponenter/Strek.tsx'
import { oppgaveIdUtenPrefix, type OppgaveV2 } from '../../oppgave/oppgaveTypes.ts'
import { formaterNavn } from '../../utils/formater.ts'
import { useOppgavekommentarer } from './useOppgavekommentarer.ts'

export interface OppgaveDetailsProps {
  oppgave: OppgaveV2
  visible?: boolean
}

export function OppgaveDetails({ oppgave, visible }: OppgaveDetailsProps) {
  const { data: kommentarer = [] } = useOppgavekommentarer(visible ? oppgave.oppgaveId : null)
  const sisteKommentar = kommentarer[0]
  const oppgaveId = oppgaveIdUtenPrefix(oppgave.oppgaveId)
  return (
    <VStack gap="5">
      <VStack gap="3">
        {oppgave.bruker && (
          <OppgaveDetailsItem
            label="Bruker"
            value={
              <HStack gap="3">
                <BodyShort size="small">{formaterNavn(oppgave.bruker.navn)}</BodyShort>
                <BodyShort size="small">{oppgave.bruker.fnr}</BodyShort>
              </HStack>
            }
          />
        )}
        {oppgave.beskrivelse && (
          <OppgaveDetailsItem label="Beskrivelse" value={parseBeskrivelse(oppgave.beskrivelse)} />
        )}
        <div>
          <Strek />
          {sisteKommentar ? (
            <OppgaveDetailsItem
              label="Siste kommentar"
              value={
                <VStack gap="2">
                  <HStack gap="2" align="center">
                    <Detail>{sisteKommentar.registrertAv}</Detail>
                    <Detail>|</Detail>
                    <Detail>{sisteKommentar.registrertAvEnhetsnummer}</Detail>
                    <Detail>|</Detail>
                    <Detail>
                      <FormatertTidspunkt dato={sisteKommentar.registrertTidspunkt} />
                    </Detail>
                  </HStack>
                  <BodyShort size="small">{sisteKommentar.tekst}</BodyShort>
                </VStack>
              }
            />
          ) : (
            <OppgaveDetailsItem
              label="Siste kommentar"
              value={
                <HStack gap="2" align="center">
                  <InformationSquareIcon />
                  <BodyShort size="small">Det er ingen kommentarer til oppgaven</BodyShort>
                </HStack>
              }
            />
          )}
        </div>
      </VStack>
      <Eksperiment>
        <div>
          <Strek />
          <VStack gap="3">
            <OppgaveDetailsItem
              label="OppgaveID"
              value={
                <BodyShort
                  as={Link}
                  href={`https://gosys-q2.dev.intern.nav.no/gosys/oppgavebehandling/oppgave/${oppgaveId}`}
                  size="small"
                  target="_blank"
                  variant="subtle"
                >
                  {oppgaveId}
                </BodyShort>
              }
            />
            <OppgaveDetailsItem label="JournalpostID" value={oppgave.journalpostId} />
            <OppgaveDetailsItem label="Saksnummer" value={oppgave.sakId} />
          </VStack>
        </div>
      </Eksperiment>
    </VStack>
  )
}

function OppgaveDetailsItem({ label, value }: { label: string; value?: ReactNode }) {
  if (!value) return null
  return (
    <VStack gap="2">
      <Label size="small">{label}</Label>
      {Array.isArray(value) || isValidElement(value) ? value : <BodyShort size="small">{value}</BodyShort>}
    </VStack>
  )
}

function parseBeskrivelse(beskrivelse: string): string {
  const elements = beskrivelse.split('\n')
  return elements.at(-1) ?? ''
}

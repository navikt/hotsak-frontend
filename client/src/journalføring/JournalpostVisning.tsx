import { Box, Heading, VStack } from '@navikt/ds-react'

import { Dokumenter } from '../dokument/Dokumenter'
import { SkjemaAlert } from '../felleskomponenter/SkjemaAlert'
import { Tekst } from '../felleskomponenter/typografi'
import { type Journalføringsoppgave, Oppgavestatus } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { type Journalpost, type Person } from '../types/types.internal.ts'
import { formaterNavn } from '../utils/formater'
import { JournalføringMenu } from './JournalføringMenu.tsx'

export interface JournalpostVisningProps {
  oppgave: Journalføringsoppgave
  journalpost: Journalpost
  personInfo: Person
  mutateJournalpost(): void
  lesevisning: boolean
}

export function JournalpostVisning({
  oppgave,
  journalpost,
  personInfo,
  mutateJournalpost,
  lesevisning,
}: JournalpostVisningProps) {
  return (
    <>
      {!lesevisning && <JournalføringMenu oppgave={oppgave} onAction={mutateJournalpost} />}
      <VStack gap="space-12">
        <Heading level="1" size="xsmall" spacing>
          Journalføring
        </Heading>
        <VStack>
          <Heading size="xsmall" level="2">
            Bruker
          </Heading>
          <Tekst>{`${formaterNavn(personInfo)} | ${personInfo.fnr}`}</Tekst>
        </VStack>
        <VStack marginInline="space-0 space-12">
          <Heading size="xsmall" level="2" spacing>
            Journalpost
          </Heading>
          <Dokumenter dokumenter={journalpost.dokumenter} />
        </VStack>
        <Box paddingBlock="space-24 space-0" paddingInline="space-0 space-24">
          <JournalpostStatus oppgave={oppgave} />
        </Box>
      </VStack>
    </>
  )
}

function JournalpostStatus({ oppgave }: { oppgave: Journalføringsoppgave }) {
  const { oppgaveErUnderBehandlingAvAnnenAnsatt } = useOppgaveregler(oppgave)

  if (!oppgave) {
    return null
  }

  if (oppgaveErUnderBehandlingAvAnnenAnsatt) {
    return <Tekst>{`Oppgaven er tildelt saksbehandler ${formaterNavn(oppgave.tildeltSaksbehandler?.navn)}`}</Tekst>
  }

  if (oppgave.oppgavestatus === Oppgavestatus.FERDIGSTILT) {
    return <SkjemaAlert variant="info">Journalposten er sendt til journalføring</SkjemaAlert>
  }

  return null
}

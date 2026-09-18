import { Box, Button, Heading, InlineMessage, VStack } from '@navikt/ds-react'

import { useNavigate } from 'react-router'
import { Dokumenter } from '../dokument/Dokumenter'
import { Tekst } from '../felleskomponenter/typografi'
import { type Journalføringsoppgave, Oppgavestatus } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { type Journalpost, type Person } from '../types/types.internal.ts'
import { formaterNavn } from '../utils/formater'
import { JournalføringMenu } from './JournalføringMenu.tsx'
import { useJournalpostSakFerdigstiltHendelse } from './useJournalpostSakFerdigstiltHendelse.ts'

export interface JournalpostVisningProps {
  sakId?: string
  oppgave: Journalføringsoppgave
  journalpost: Journalpost
  personInfo: Person
  mutateJournalpost(): void
}

export function JournalpostVisning(props: JournalpostVisningProps) {
  const { sakId, oppgave, journalpost, personInfo, mutateJournalpost } = props
  const navigate = useNavigate()
  const { journalpostSakFerdigstilt, isActive } = useJournalpostSakFerdigstiltHendelse(sakId)
  const isLoading = !journalpostSakFerdigstilt?.oppgaveId
  return (
    <>
      <JournalføringMenu oppgave={oppgave} onAction={mutateJournalpost} />
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
        {oppgave.oppgavestatus === Oppgavestatus.FERDIGSTILT && isActive && (
          <div>
            <Button
              type="button"
              disabled={isLoading}
              loading={isLoading}
              variant="primary"
              size="small"
              onClick={() => navigate(`/oppgave/${journalpostSakFerdigstilt?.oppgaveId}`)}
            >
              Åpne saken
            </Button>
          </div>
        )}
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
    return <InlineMessage status="info">Journalposten er sendt til journalføring</InlineMessage>
  }

  return null
}

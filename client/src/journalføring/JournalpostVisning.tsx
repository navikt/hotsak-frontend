import { Box, Heading, VStack } from '@navikt/ds-react'
import styled from 'styled-components'

import { Dokumenter } from '../dokument/Dokumenter'
import { SkjemaAlert } from '../felleskomponenter/SkjemaAlert'
import { Toast } from '../felleskomponenter/toast/Toast.tsx'
import { Tekst } from '../felleskomponenter/typografi'
import { Oppgavestatus } from '../oppgave/oppgaveTypes.ts'
import { TaOppgaveButton } from '../oppgave/TaOppgaveButton.tsx'
import { useOppgave } from '../oppgave/useOppgave.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { usePersonContext } from '../personoversikt/PersonContext'
import { usePerson } from '../personoversikt/usePerson'
import { useJournalpost } from '../saksbilde/useJournalpost'
import { formaterNavn } from '../utils/formater'
import { JournalføringMenu } from './JournalføringMenu.tsx'

export interface JournalpostVisningProps {
  journalpostId: string
  lesevisning: boolean
}

export function JournalpostVisning({ journalpostId, lesevisning }: JournalpostVisningProps) {
  const { journalpost, isLoading, mutate } = useJournalpost(journalpostId)
  const { fodselsnummer } = usePersonContext()
  const { isLoading: henterPerson, personInfo } = usePerson(fodselsnummer)

  if (henterPerson || !personInfo || isLoading || !journalpost) {
    return (
      <Container>
        <Toast>Henter journalpost</Toast>
      </Container>
    )
  }

  return (
    <Container>
      {!lesevisning && <JournalføringMenu onAction={mutate} />}
      <VStack gap="space-12">
        <Heading level="1" size="xsmall" spacing>
          Journalføring
        </Heading>
        <VStack>
          <Heading size="xsmall" level="2">
            Bruker
          </Heading>
          <Tekst>{`${formaterNavn(personInfo)} | ${personInfo?.fnr}`}</Tekst>
        </VStack>
        <VStack marginInline="space-0 space-12">
          <Heading size="xsmall" level="2" spacing>
            Journalpost
          </Heading>
          <Dokumenter dokumenter={journalpost.dokumenter} />
        </VStack>
        <Box paddingBlock="space-24 space-0" paddingInline="space-0 space-24">
          <Status lesevisning={lesevisning} onOppgavetildeling={() => mutate()} />
        </Box>
      </VStack>
    </Container>
  )
}

function Status({ lesevisning, onOppgavetildeling }: { lesevisning: boolean; onOppgavetildeling(): void }) {
  const { oppgave } = useOppgave()
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

  if (lesevisning) {
    return null
  }

  return (
    <TaOppgaveButton oppgave={oppgave} onOppgavetildeling={onOppgavetildeling}>
      Start journalføring
    </TaOppgaveButton>
  )
}

const Container = styled.div`
  overflow: auto;
  border-right: 1px solid var(--ax-border-neutral-subtle);
  padding-top: var(--ax-space-16);
  padding-right: var(--ax-space-16);
`

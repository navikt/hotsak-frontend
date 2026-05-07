import { Box, Heading, VStack } from '@navikt/ds-react'

import { Dokumenter } from '../dokument/Dokumenter'
import { SkjemaAlert } from '../felleskomponenter/SkjemaAlert'
import { Toast } from '../felleskomponenter/toast/Toast.tsx'
import { Tekst } from '../felleskomponenter/typografi'
import { type Journalføringsoppgave, Oppgavestatus } from '../oppgave/oppgaveTypes.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { usePersonContext } from '../personoversikt/PersonContext'
import { usePerson } from '../personoversikt/usePerson'
import { useJournalpost } from '../saksbilde/useJournalpost'
import { formaterNavn } from '../utils/formater'
import { JournalføringMenu } from './JournalføringMenu.tsx'
import classes from './JournalpostVisning.module.css'

export interface JournalpostVisningProps {
  oppgave: Journalføringsoppgave
  lesevisning: boolean
}

export function JournalpostVisning({ oppgave, lesevisning }: JournalpostVisningProps) {
  const { journalpostId } = oppgave
  const { journalpost, isLoading, mutate } = useJournalpost(journalpostId)
  const { fodselsnummer } = usePersonContext()
  const { isLoading: henterPerson, personInfo } = usePerson(fodselsnummer)

  if (henterPerson || !personInfo || isLoading || !journalpost) {
    return (
      <div className={classes.container}>
        <Toast>Henter journalpost</Toast>
      </div>
    )
  }

  return (
    <div className={classes.container}>
      {!lesevisning && <JournalføringMenu oppgave={oppgave} onAction={mutate} />}
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
          <JournalpostStatus oppgave={oppgave} />
        </Box>
      </VStack>
    </div>
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

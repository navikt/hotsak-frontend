import { useParams } from 'react-router'
import styled from 'styled-components'
import { Box, Heading, VStack } from '@navikt/ds-react'

import { Knappepanel } from '../felleskomponenter/Knappepanel'
import { SkjemaAlert } from '../felleskomponenter/SkjemaAlert'
import { Toast } from '../felleskomponenter/Toast'
import { Brødtekst } from '../felleskomponenter/typografi'
import { usePersonContext } from '../personoversikt/PersonContext'
import { usePerson } from '../personoversikt/usePerson'
import { useJournalpost } from '../saksbilde/useJournalpost'
import { DokumentIkkeTildelt } from '../oppgaveliste/dokumenter/DokumentIkkeTildelt'
import { Dokumenter } from '../dokument/Dokumenter'
import { ManuellJournalføringKnapp } from './ManuellJournalføringKnapp'
import { formaterNavn } from '../utils/formater'
import { Oppgavestatus } from '../types/types.internal'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'

export function JournalpostVisning({ lesevisning }: { lesevisning: boolean }) {
  const { journalpostId } = useParams<{ journalpostId: string }>()
  const { journalpost, /*isError,*/ isLoading, mutate } = useJournalpost(journalpostId)
  const { fodselsnummer } = usePersonContext()
  const { isLoading: henterPerson, personInfo } = usePerson(fodselsnummer)
  const saksbehandler = useInnloggetAnsatt()

  if (henterPerson || !personInfo || isLoading || !journalpost) {
    return (
      <Container>
        <Toast>Henter journalpost</Toast>
      </Container>
    )
  }

  const oppgave = journalpost!.oppgave

  const tildeltAnnenSaksbehandler = oppgave?.tildeltSaksbehandler?.id !== saksbehandler.id

  function StatusVisning() {
    if (!journalpost) return <></>
    else if (oppgave.oppgavestatus === Oppgavestatus.UNDER_BEHANDLING && tildeltAnnenSaksbehandler) {
      return (
        <Brødtekst>{`Oppgaven er tildelt saksbehandler ${formaterNavn(oppgave.tildeltSaksbehandler?.navn)}`}</Brødtekst>
      )
    } else if (oppgave.oppgavestatus === Oppgavestatus.FERDIGSTILT) {
      return <SkjemaAlert variant="info">Journalposten er sendt til journalføring</SkjemaAlert>
    } else {
      return (
        !lesevisning && (
          <Knappepanel>
            <DokumentIkkeTildelt
              oppgaveId={journalpost.oppgave.oppgaveId}
              journalpostId={journalpost.journalpostId}
              gåTilSak={false}
            />
          </Knappepanel>
        )
      )
    }
  }

  return (
    <Container>
      {!lesevisning && (
        <ManuellJournalføringKnapp
          oppgaveId={oppgave.oppgaveId}
          status={oppgave.oppgavestatus}
          tildeltSaksbehandler={oppgave?.tildeltSaksbehandler}
          onMutate={mutate}
        />
      )}
      <VStack gap="3">
        <Heading level="1" size="xsmall" spacing>
          Journalføring
        </Heading>
        <VStack>
          <Heading size="xsmall" level="2">
            Bruker
          </Heading>
          <Brødtekst>{`${formaterNavn(personInfo)} | ${personInfo?.fnr}`}</Brødtekst>
        </VStack>
        <VStack marginInline="0 3">
          <Heading size="xsmall" level="2" spacing>
            Journalpost
          </Heading>
          <Dokumenter dokumenter={journalpost.dokumenter} />
        </VStack>
        <Box paddingBlock="6 0" paddingInline="0 6">
          <StatusVisning />
        </Box>
      </VStack>
    </Container>
  )
}

const Container = styled.div`
  overflow: auto;
  border-right: 1px solid var(--a-border-default);
  padding-top: var(--a-spacing-4);
  padding-right: var(--a-spacing-4);
`

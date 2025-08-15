import { Box, Heading, VStack } from '@navikt/ds-react'
import styled from 'styled-components'

import { Dokumenter } from '../dokument/Dokumenter'
import { Knappepanel } from '../felleskomponenter/Knappepanel'
import { SkjemaAlert } from '../felleskomponenter/SkjemaAlert'
import { Toast } from '../felleskomponenter/Toast'
import { Brødtekst } from '../felleskomponenter/typografi'
import { Oppgavestatus } from '../oppgave/oppgaveTypes.ts'
import { TaOppgaveContextButton } from '../oppgave/TaOppgaveContextButton.tsx'
import { usePersonContext } from '../personoversikt/PersonContext'
import { usePerson } from '../personoversikt/usePerson'
import { useJournalpost } from '../saksbilde/useJournalpost'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { formaterNavn } from '../utils/formater'
import { JournalføringKnapp } from './JournalføringKnapp.tsx'

export interface JournalpostVisningProps {
  journalpostId: string
  lesevisning: boolean
}

export function JournalpostVisning({ journalpostId, lesevisning }: JournalpostVisningProps) {
  const { journalpost, isLoading, mutate } = useJournalpost(journalpostId)
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
            <TaOppgaveContextButton
              onAction={async () => {
                await mutate()
              }}
            >
              Start journalføring
            </TaOppgaveContextButton>
          </Knappepanel>
        )
      )
    }
  }

  return (
    <Container>
      {!lesevisning && (
        <JournalføringKnapp
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

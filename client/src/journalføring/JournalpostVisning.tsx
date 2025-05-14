import { useParams } from 'react-router'
import styled from 'styled-components'
import { Heading } from '@navikt/ds-react'

import { Avstand } from '../felleskomponenter/Avstand'
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
      <Heading level="1" size="small" spacing>
        Journalføring
      </Heading>
      <Avstand paddingTop={4} />
      <Heading size="small" level="2" spacing>
        Bruker
      </Heading>
      <Avstand marginRight={3}>
        <Brødtekst>{`${formaterNavn(personInfo)} | ${personInfo?.fnr}`}</Brødtekst>
      </Avstand>
      <Avstand paddingTop={8} marginRight={3}>
        <Heading size="small" level="2" spacing>
          Journalpost
        </Heading>
      </Avstand>
      <Avstand paddingTop={4}>
        <Dokumenter dokumenter={journalpost.dokumenter} />
      </Avstand>
      <Avstand paddingTop={6} paddingRight={6}>
        <StatusVisning />
      </Avstand>
    </Container>
  )
}

const Container = styled.div`
  overflow: auto;
  border-right: 1px solid var(--a-border-default);
  padding-top: var(--a-spacing-4);
  padding-right: var(--a-spacing-4);
`

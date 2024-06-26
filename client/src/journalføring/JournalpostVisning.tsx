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
import { useInnloggetSaksbehandler } from '../state/authentication'
import { DokumentOppgaveStatusType } from '../types/types.internal'
import { DokumentIkkeTildelt } from '../oppgaveliste/dokumenter/DokumentIkkeTildelt'
import { Dokumenter } from '../dokument/Dokumenter'
import { ManuellJournalføringKnapp } from './ManuellJournalføringKnapp'
import { formaterNavn } from '../utils/formater'

export function JournalpostVisning() {
  const { journalpostID } = useParams<{ journalpostID: string }>()
  const { journalpost, /*isError,*/ isLoading, mutate } = useJournalpost(journalpostID)
  const { fodselsnummer } = usePersonContext()
  const { isLoading: henterPerson, personInfo } = usePerson(fodselsnummer)
  const saksbehandler = useInnloggetSaksbehandler()

  if (henterPerson || !personInfo || isLoading || !journalpost) {
    return (
      <Container>
        <Toast>Henter journalpost</Toast>
      </Container>
    )
  }

  const oppgave = journalpost!.oppgave

  const tildeltAnnenSaksbehandler = journalpost?.saksbehandler?.id !== saksbehandler.id

  function StatusVisning() {
    if (!journalpost) return <></>
    else if (journalpost.status === DokumentOppgaveStatusType.TILDELT_SAKSBEHANDLER && tildeltAnnenSaksbehandler) {
      return <Brødtekst>{`Oppgaven er tildelt saksbehandler ${journalpost.saksbehandler?.navn}`}</Brødtekst>
    } else if (
      journalpost.status === DokumentOppgaveStatusType.AVVENTER_JOURNALFØRING ||
      journalpost.status === DokumentOppgaveStatusType.JOURNALFØRT
    ) {
      return <SkjemaAlert variant="info">Journalposten er sendt til journalføring</SkjemaAlert>
    } else {
      return (
        <Knappepanel>
          <DokumentIkkeTildelt
            oppgaveId={journalpost.oppgave.id}
            journalpostID={journalpost.journalpostID}
            gåTilSak={false}
          />
        </Knappepanel>
      )
    }
  }

  return (
    <Container>
      <ManuellJournalføringKnapp
        oppgaveId={oppgave.id}
        status={oppgave.oppgavestatus}
        tildeltSaksbehandler={journalpost?.saksbehandler}
        onMutate={mutate}
      />
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

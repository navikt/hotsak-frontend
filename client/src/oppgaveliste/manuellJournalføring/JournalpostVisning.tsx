//import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { useParams } from 'react-router'
import styled from 'styled-components'

import { Heading } from '@navikt/ds-react'

import { Avstand } from '../../felleskomponenter/Avstand'
import { Knappepanel } from '../../felleskomponenter/Button'
import { Toast } from '../../felleskomponenter/Toast'
import { Brødtekst } from '../../felleskomponenter/typografi'
import { usePersonContext } from '../../personoversikt/PersonContext'
import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { formaterNavn } from '../../saksbilde/Personlinje'
import { useInnloggetSaksbehandler } from '../../state/authentication'
import { DokumentOppgaveStatusType } from '../../types/types.internal'
import { DokumentIkkeTildelt } from '../dokumenter/DokumentIkkeTildelt'
import { useDokument } from '../dokumenter/dokumentHook'
import { Dokumenter } from './Dokumenter'

const Container = styled.div`
  overflow: auto;
  border-right: 1px solid var(--a-border-default);
  padding-top: var(--a-spacing-6);
`

export const JournalpostVisning: React.FC = () => {
  const { journalpostID } = useParams<{ journalpostID: string }>()
  const { journalpost, /*isError,*/ isLoading } = useDokument(journalpostID)
  const { fodselsnummer } = usePersonContext()
  const { isLoading: henterPerson, personInfo } = usePersonInfo(fodselsnummer)
  const saksbehandler = useInnloggetSaksbehandler()

  if (henterPerson || !personInfo || isLoading || !journalpost) {
    return (
      <Container>
        <Toast>Henter journalpost</Toast>
      </Container>
    )
  }

  const tildeltAnnenSaksbehandler = journalpost?.saksbehandler?.objectId !== saksbehandler.objectId

  return (
    <Container>
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
        <Brødtekst>{journalpost.tittel}</Brødtekst>
      </Avstand>
      <Avstand paddingTop={4}>
        <Dokumenter journalpostID={journalpostID} />
      </Avstand>
      <Avstand paddingTop={6}>
        {journalpost.status === DokumentOppgaveStatusType.TILDELT_SAKSBEHANDLER && tildeltAnnenSaksbehandler ? (
          <Brødtekst>{`Oppgaven er tildelt saksbehandler ${journalpost.saksbehandler?.navn}`}</Brødtekst>
        ) : (
          <Knappepanel>
            <DokumentIkkeTildelt journalpostID={journalpost.journalpostID} gåTilSak={false} />
          </Knappepanel>
        )}
      </Avstand>
    </Container>
  )
}

//import { usePersonInfo } from '../../personoversikt/personInfoHook'
import styled from 'styled-components'

import { Heading, Loader } from '@navikt/ds-react'

import { Avstand } from '../../felleskomponenter/Avstand'
import { ButtonContainer } from '../../felleskomponenter/Dialogboks'
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
  padding-top: var(--a-spacing-6);
`

const Kolonner = styled.div`
  display: flex;
  gap: 1rem;
  width: 100%;
  align-self: flex-end;
  align-items: flex-end;
`

const IconContainer = styled.span`
  margin-right: 0.4rem;
`

export const JournalpostVisning: React.FC = () => {
  const { journalpost, /*isError,*/ isLoading } = useDokument()
  const { fodselsnummer } = usePersonContext()
  const { isLoading: henterPerson, personInfo } = usePersonInfo(fodselsnummer)
  const saksbehandler = useInnloggetSaksbehandler()

  if (henterPerson || !personInfo) {
    return (
      <div>
        <Loader /> Henter personinfo
      </div>
    )
  }

  if (isLoading || !journalpost) {
    return (
      <div>
        <Loader />
        Henter journalpost...
      </div>
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
        <Dokumenter />
      </Avstand>
      <Avstand paddingTop={6}>
        {journalpost.journalstatus === DokumentOppgaveStatusType.TILDELT_SAKSBEHANDLER && tildeltAnnenSaksbehandler ? (
          <Brødtekst>{`Oppgaven er tildelt saksbehandler ${journalpost.saksbehandler?.navn}`}</Brødtekst>
        ) : (
          <ButtonContainer>
            <DokumentIkkeTildelt journalpostID={journalpost.journalpostID} gåTilSak={false} />
          </ButtonContainer>
        )}
      </Avstand>
    </Container>
  )
}

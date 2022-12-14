//import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { useState } from 'react'
import styled from 'styled-components'

import { Applicant, File } from '@navikt/ds-icons'
import { Accordion, Button, Heading, Loader, Panel, TextField } from '@navikt/ds-react'

import { Avstand } from '../../felleskomponenter/Avstand'
import { formaterNavn } from '../../saksbilde/Personlinje'
import { PersonoversiktType } from '../../types/types.internal'
import { useDokument } from '../dokumenter/dokumentHook'
import { Dokumenter } from './Dokumenter'

const Container = styled.div`
  overflow: auto;
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

export const JournalpostSkjema: React.FC = () => {
  const { journalpost, /*isError,*/ isLoading } = useDokument()
  const [journalføresPåFnr, setJournalføresPåFnr] = useState(journalpost?.fnr)
  //const { personInfo } = usePersonInfo(journalføresPåFnr)
  //const {personInfo as innsender } = usePersonInfo(journalpost)

  const personInfo: PersonoversiktType = {
    fnr: '19044238651',
    fødselsdato: '1942-12-19',
    fornavn: 'Navn',
    etternavn: 'Navnesen',
    kjønn: 'MANN',
  }

  if (isLoading || !journalpost) {
    return (
      <div>
        <Loader />
        Henter journalpost...
      </div>
    )
  }

  //const { journalpostID, journalpostOpprettetDato, tittel, fnr, journalstatus, saksbehandler, dokumenter } = journalpost

  return (
    <Container>
      <form>
        <Panel>
          <Accordion>
            <Accordion.Item defaultOpen={true}>
              <Accordion.Header>
                <IconContainer>
                  <File />
                </IconContainer>
                {journalpost.tittel}
              </Accordion.Header>
              <Accordion.Content>
                <TextField label="Dokumentittel" size="small" value={journalpost.tittel} />
                <Avstand paddingBottom={4} />
                <TextField label="Annet innhold/Navn på vedlegg" size="small"></TextField>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Panel>
        <Avstand paddingTop={8} />
        <Heading size="small" level="2" spacing>
          Bruker
        </Heading>
        <Panel>
          <Accordion>
            <Accordion.Item defaultOpen={true}>
              <Accordion.Header>
                <IconContainer>
                  <Applicant />
                </IconContainer>
                {`${formaterNavn(personInfo)} | ${personInfo?.fnr}` /* Bruke felles personcontext her? */}
              </Accordion.Header>
              <Accordion.Content>
                <Kolonner>
                  <TextField label="Endre bruker" description="Skriv inn fødselsnummer" size="small" />
                  <Button variant="secondary" size="small">
                    Endre bruker
                  </Button>
                </Kolonner>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Panel>
        <Heading size="small" level="2" spacing>
          Innsender
        </Heading>
        <Panel>
          <Accordion>
            <Accordion.Item defaultOpen={true}>
              <Accordion.Header>
                <IconContainer>
                  <Applicant />
                </IconContainer>
                {`${formaterNavn(personInfo)} | ${personInfo?.fnr}` /* Bruke felles personcontext her? */}
              </Accordion.Header>
              <Accordion.Content>
                <Kolonner>
                  <TextField label="Endre bruker" description="Skriv inn fødselsnummer" size="small" />
                  <Button variant="secondary" size="small">
                    Endre bruker
                  </Button>
                </Kolonner>
              </Accordion.Content>
            </Accordion.Item>
          </Accordion>
        </Panel>
        <Dokumenter />
        <Button type="submit" variant="primary">
          Journalfør
        </Button>
      </form>
    </Container>
  )
}

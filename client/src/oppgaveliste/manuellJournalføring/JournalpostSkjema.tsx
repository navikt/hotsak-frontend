//import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { useState } from 'react'
import styled from 'styled-components'

import { Button, Heading, Loader, Panel, TextField } from '@navikt/ds-react'

import { Avstand } from '../../felleskomponenter/Avstand'
import { ButtonContainer } from '../../felleskomponenter/Dialogboks'
import { usePersonContext } from '../../personoversikt/PersonContext'
import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { formaterNavn } from '../../saksbilde/Personlinje'
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

export const JournalpostSkjema: React.FC = () => {
  const { journalpost, /*isError,*/ isLoading } = useDokument()
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const [journalføresPåFnr, setJournalføresPåFnr] = useState('')
  const { isLoading: henterPerson, personInfo } = usePersonInfo(fodselsnummer)

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

  return (
    <Container>
      <Heading level="1" size="small" spacing>
        Journalføring
      </Heading>
      <form>
        <Heading size="small" level="2" spacing>
          Bruker
        </Heading>
        <Avstand marginRight={3}>
          <Panel border>
            <Heading level="3" size="small" spacing>
              {`${formaterNavn(personInfo)} | ${personInfo?.fnr}`}
            </Heading>
            <Kolonner>
              <TextField
                label="Endre bruker"
                description="Skriv inn fødselsnummer"
                size="small"
                value={journalføresPåFnr}
                onChange={(e) => setJournalføresPåFnr(e.target.value)}
              />
              <Button
                variant="secondary"
                size="small"
                onClick={() => {
                  setFodselsnummer(journalføresPåFnr)
                }}
              >
                Endre bruker
              </Button>
            </Kolonner>
          </Panel>
        </Avstand>
        <Avstand paddingTop={8} marginRight={3}>
          <Heading size="small" level="2" spacing>
            Journalpost
          </Heading>
          <Panel border>
            <Heading level="3" size="small" spacing>
              {journalpost.tittel}
            </Heading>
            <TextField label="Dokumentittel" size="small" defaultValue={journalpost.tittel} />
            <Avstand paddingBottom={4} />
            <TextField label="Annet innhold/Navn på vedlegg" size="small"></TextField>
          </Panel>
        </Avstand>
        <Avstand paddingTop={4}>
          <Dokumenter />
        </Avstand>
        <Avstand paddingLeft={2}>
          <ButtonContainer>
            <Button type="submit" variant="primary" size="small">
              Journalfør
            </Button>
          </ButtonContainer>
        </Avstand>
      </form>
    </Container>
  )
}

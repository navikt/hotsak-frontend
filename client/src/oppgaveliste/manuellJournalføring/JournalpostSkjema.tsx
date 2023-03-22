import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { Applicant } from '@navikt/ds-icons'
import { Button, ExpansionCard, Heading, Loader, TextField } from '@navikt/ds-react'

import { postJournalfør } from '../../io/http'

import { Avstand } from '../../felleskomponenter/Avstand'
import { Knappepanel } from '../../felleskomponenter/Button'
import { Kolonner } from '../../felleskomponenter/Kolonner'
import { Toast } from '../../felleskomponenter/Toast'
import { IconContainer } from '../../felleskomponenter/ikoner/Ikon'
import { usePersonContext } from '../../personoversikt/PersonContext'
import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { formaterNavn } from '../../saksbilde/Personlinje'
import { JournalførRequest } from '../../types/types.internal'
import { useDokument } from '../dokumenter/dokumentHook'
import { Dokumenter } from './Dokumenter'

const Container = styled.div`
  overflow: auto;
  border-right: 1px solid var(--a-border-default);
  padding-top: var(--a-spacing-6);
  padding-right: var(--a-spacing-4);
`
export const JournalpostSkjema: React.FC = () => {
  const navigate = useNavigate()
  const { journalpostID } = useParams<{ journalpostID: string }>()
  const { journalpost, /*isError,*/ isLoading } = useDokument(journalpostID)
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const [journalføresPåFnr, setJournalføresPåFnr] = useState('')
  const { isLoading: henterPerson, personInfo } = usePersonInfo(fodselsnummer)
  const [journalpostTittel, setJournalpostTittel] = useState(journalpost?.tittel || '')
  // const [error, setError] = useState('')
  const [journalfører, setJournalfører] = useState(false)

  const journalfør = () => {
    const journalpostRequest: JournalførRequest = {
      journalpostID: journalpost!.journalpostID,
      tittel: journalpostTittel,
      journalføresPåFnr: fodselsnummer,
    }

    setJournalfører(true)
    postJournalfør(journalpostRequest)
      .catch(() => setJournalfører(false))
      .then((opprettetSakResponse: any) => {
        const opprettetSakID = opprettetSakResponse.data.sakId

        setJournalfører(false)
        if (!opprettetSakID) {
          throw new Error('Klarte ikke å opprette sak')
        }

        navigate(`/sak/${opprettetSakID}`)
      })
  }

  if (henterPerson || !personInfo || isLoading || !journalpost) {
    return (
      <Container>
        <Toast>Henter journalpost</Toast>
      </Container>
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
        <Avstand marginRight={3} paddingLeft={1}>
          <ExpansionCard size="small" aria-label="Bruker det skal journalføres på">
            <ExpansionCard.Header>
              <ExpansionCard.Title as="h3" size="small">
                <IconContainer>
                  <Applicant />
                </IconContainer>
                {`${formaterNavn(personInfo)} | ${personInfo?.fnr}`}
              </ExpansionCard.Title>
            </ExpansionCard.Header>
            <ExpansionCard.Content>
              <Kolonner>
                <TextField
                  label="Endre bruker"
                  description="Skriv inn fødselsnummer eller D-nummer"
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
                  disabled={henterPerson}
                  loading={henterPerson}
                >
                  Endre bruker
                </Button>
              </Kolonner>
            </ExpansionCard.Content>
          </ExpansionCard>
        </Avstand>
        <Avstand paddingTop={8} marginRight={3} marginLeft={2}>
          <Heading size="small" level="2" spacing>
            Journalpost
          </Heading>
          <TextField
            label="Dokumentittel"
            description="Tittelen blir synlig i fagsystemer og for bruker"
            size="small"
            value={journalpostTittel}
            onChange={(e) => setJournalpostTittel(e.target.value)}
          />
        </Avstand>
        <Dokumenter journalpostID={journalpostID} />
        <Avstand paddingLeft={2}>
          <Knappepanel>
            <Button
              type="submit"
              variant="primary"
              size="small"
              onClick={(e) => {
                e.preventDefault()
                journalfør()
              }}
              data-cy="btn-journalfør"
              disabled={journalfører}
              loading={journalfører}
            >
              Journalfør
            </Button>
          </Knappepanel>
        </Avstand>
      </form>
    </Container>
  )
}

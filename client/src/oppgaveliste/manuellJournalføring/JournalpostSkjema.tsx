import { useState } from 'react'
import { useNavigate, useParams } from 'react-router'
import styled from 'styled-components'

import { Applicant } from '@navikt/ds-icons'
import { Button, ExpansionCard, Heading, Loader, TextField } from '@navikt/ds-react'

import { postJournalføring, postTilbakeføring } from '../../io/http'

import { Avstand } from '../../felleskomponenter/Avstand'
import { Knappepanel } from '../../felleskomponenter/Button'
import { Eksperiment } from '../../felleskomponenter/Eksperiment'
import { Kolonner } from '../../felleskomponenter/Kolonner'
import { Toast } from '../../felleskomponenter/Toast'
import { IconContainer } from '../../felleskomponenter/ikoner/Ikon'
import { usePersonContext } from '../../personoversikt/PersonContext'
import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { formaterNavn } from '../../saksbilde/Personlinje'
import { JournalføringRequest } from '../../types/types.internal'
import { useDokument } from '../dokumenter/dokumentHook'
import { Dokumenter } from './Dokumenter'
import { FlyttGosysModal } from './FlyttGosysModal'

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
  const [visFlyttGosysModal, setVisFlyttGosysModal] = useState(false)
  const [tilbakefører, setTilbakefører] = useState(false)

  const journalfør = () => {
    const journalføringRequest: JournalføringRequest = {
      journalpostID: journalpost!.journalpostID,
      tittel: journalpostTittel,
      journalføresPåFnr: fodselsnummer,
    }
    setJournalfører(true)
    postJournalføring(journalføringRequest)
      .then((opprettetSakResponse: any) => {
        const opprettetSakID = opprettetSakResponse.data.sakId

        if (!opprettetSakID) {
          throw new Error('Klarte ikke å opprette sak')
        }

        navigate(`/sak/${opprettetSakID}`)
      })
      .catch(() => setJournalfører(false))
  }

  const tilbakefør = () => {
    setTilbakefører(true)
    postTilbakeføring(journalpost!.journalpostID)
      .then(() => {
        navigate('/oppgaveliste/dokumenter')
      })
      .catch(() => {
        setTilbakefører(false)
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
              disabled={journalfører || tilbakefører}
              loading={journalfører}
            >
              Journalfør
            </Button>
            <Eksperiment>
              <Button
                type="button"
                variant="secondary"
                size="small"
                onClick={(e) => {
                  e.preventDefault()
                  setVisFlyttGosysModal(true)
                }}
                data-cy="btn-flytt-til-gosys-modal"
                disabled={journalfører || tilbakefører}
                loading={tilbakefører}
              >
                Flytt til Gosys
              </Button>
            </Eksperiment>
          </Knappepanel>
        </Avstand>
      </form>
      <FlyttGosysModal
        open={visFlyttGosysModal}
        loading={tilbakefører}
        onBekreft={tilbakefør}
        onClose={() => {
          setVisFlyttGosysModal(false)
        }}
      />
    </Container>
  )
}

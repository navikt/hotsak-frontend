//import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import { Button, Checkbox, CheckboxGroup, Heading, Loader, Panel, TextField } from '@navikt/ds-react'

import { postJournalfør } from '../../io/http'

import { Avstand } from '../../felleskomponenter/Avstand'
import { ButtonContainer } from '../../felleskomponenter/Dialogboks'
import { usePersonContext } from '../../personoversikt/PersonContext'
import { usePersonInfo } from '../../personoversikt/personInfoHook'
import { formaterNavn } from '../../saksbilde/Personlinje'
import { JournalførRequest } from '../../types/types.internal'
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

export const JournalpostSkjema: React.FC = () => {
  const navigate = useNavigate()
  const { journalpost, /*isError,*/ isLoading } = useDokument()
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const [journalføresPåFnr, setJournalføresPåFnr] = useState('')
  const { isLoading: henterPerson, personInfo } = usePersonInfo(fodselsnummer)
  const [journalpostTittel, setJournalpostTittel] = useState(journalpost?.tittel || '')
  const [vedlegg, setVedlegg] = useState<string[]>([])
  const [annetVedlegg, setAnnetVedlegg] = useState<string>('')
  const manglerAnnetVedlegg = vedlegg.includes('Annet') && annetVedlegg.trim().length < 3
  const [error, setError] = useState('')
  const [journalfører, setJournalfører] = useState(false)

  const byggVedleggBeskrivelse = (): string[] => {
    if (vedlegg.includes('Annet')) {
      return vedlegg.filter((v) => v !== 'Annet').concat([annetVedlegg])
    } else {
      return vedlegg
    }
  }

  const journalfør = () => {
    const journalpostRequest: JournalførRequest = {
      journalpostID: journalpost!.journalpostID,
      tittel: journalpostTittel,
      journalføresPåFnr: fodselsnummer,
      vedlegg: byggVedleggBeskrivelse(),
    }

    setJournalfører(true)
    postJournalfør(journalpostRequest)
      .catch(() => setJournalfører(false))
      .then((opprettetSakResponse: any) => {
        const opprettetSakID = opprettetSakResponse.data.sakID

        if (!opprettetSakID) {
          throw new Error('Klarte ikke å opprette sak')
        }

        setJournalfører(false)
        navigate(`/sak/${opprettetSakID}`)
      })
  }

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
                disabled={journalfører}
                loading={journalfører}
              >
                Endre bruker
              </Button>
            </Kolonner>
          </Panel>
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
          <VedleggCheckboxGroup
            legend="Hvilke vedlegg er med?"
            onChange={setVedlegg}
            size="small"
            error={manglerAnnetVedlegg && error}
          >
            <Checkbox value="Brilleseddel">Brilleseddel</Checkbox>
            <Checkbox value="Bestillingsbekreftelse">Bestillingsbekreftelse</Checkbox>
            <Checkbox value="Vergeattest">Vergeattest</Checkbox>
            <Checkbox value="Annet">Annet</Checkbox>
          </VedleggCheckboxGroup>
          <TextField
            label="Andre vedlegg (valgfri)"
            description="Kort beskrivelse av andre vedlegg hvis du har valgt 'Annet' "
            value={annetVedlegg}
            onChange={(e) => setAnnetVedlegg(e.target.value)}
            size="small"
          />
        </Avstand>
        <Avstand paddingTop={6}>
          <Dokumenter />
        </Avstand>
        <Avstand paddingLeft={2}>
          <ButtonContainer>
            <Button
              type="submit"
              variant="primary"
              size="small"
              onClick={(e) => {
                e.preventDefault()
                /*if (manglerVedlegg) {
                  setError('Du må velge minst en årsak i listen over.')
                } else*/ if (manglerAnnetVedlegg) {
                  setError('Du må gi en begrunnelse når det er huket av for Annet.')
                } else {
                  journalfør()
                }
              }}
              data-cy="btn-journalfør"
              disabled={journalfører}
              loading={journalfører}
            >
              Journalfør
            </Button>
          </ButtonContainer>
        </Avstand>
      </form>
    </Container>
  )
}

const VedleggCheckboxGroup = styled(CheckboxGroup)`
  margin: var(--a-spacing-6) 0;
`

import { PersonEnvelopeIcon } from '@navikt/aksel-icons'
import { Box, Button, ExpansionCard, Heading, HStack, TextField, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import { Dokumenter } from '../dokument/Dokumenter'
import { Kolonner } from '../felleskomponenter/Kolonner'
import { Toast } from '../felleskomponenter/Toast'
import { postJournalføring } from '../io/http'
import { usePersonContext } from '../personoversikt/PersonContext'
import { useSaksoversikt } from '../personoversikt/saksoversiktHook'
import { usePerson } from '../personoversikt/usePerson'
import { useJournalpost } from '../saksbilde/useJournalpost'
import { BehandlingstatusType, JournalføringRequest, Sakstype } from '../types/types.internal'
import { formaterNavn } from '../utils/formater'
import { JournalføringMenu } from './JournalføringMenu.tsx'
import { KnyttTilEksisterendeSak } from './KnyttTilEksisterendeSak'

export interface JournalpostSkjemaProps {
  journalpostId: string
}

export function JournalpostSkjema({ journalpostId }: JournalpostSkjemaProps) {
  const navigate = useNavigate()
  const { journalpost, isLoading, mutate } = useJournalpost(journalpostId)
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const [valgtEksisterendeSakId, setValgtEksisterendeSakId] = useState('')
  const [journalføresPåFnr, setJournalføresPåFnr] = useState('')
  const { isLoading: henterPerson, personInfo } = usePerson(fodselsnummer)
  const { saksoversikt } = useSaksoversikt(fodselsnummer, Sakstype.BARNEBRILLER, BehandlingstatusType.ÅPEN)
  const [journalpostTittel, setJournalpostTittel] = useState(journalpost?.tittel || '')
  const [journalfører, setJournalfører] = useState(false)

  const journalfør = () => {
    const journalføringRequest: JournalføringRequest = {
      journalpostId: journalpost!.journalpostId,
      tittel: journalpostTittel,
      journalføresPåFnr: fodselsnummer,
      sakId: valgtEksisterendeSakId !== '' ? valgtEksisterendeSakId : undefined,
      oppgaveId: journalpost!.oppgave.oppgaveId,
    }
    setJournalfører(true)
    postJournalføring(journalføringRequest)
      .then((opprettetSakResponse: any) => {
        const opprettetSakId = opprettetSakResponse.data.sakId
        if (!opprettetSakId) {
          throw new Error('Klarte ikke å opprette sak')
        }
        navigate(`/oppgave/S-${opprettetSakId}`)
      })
      .catch(() => setJournalfører(false))
  }

  if (henterPerson || !personInfo || isLoading) {
    return (
      <Container>
        <Toast>Henter journalpost</Toast>
      </Container>
    )
  }

  return (
    <Container>
      <JournalføringMenu onAction={mutate} />
      <Heading level="1" size="small" spacing>
        Journalføring
      </Heading>
      <form>
        <VStack gap="6">
          <div>
            <Heading size="small" level="2" spacing>
              Bruker
            </Heading>

            <Box paddingInline="1 3">
              <ExpansionCard size="small" aria-label="Bruker det skal journalføres på">
                <ExpansionCard.Header>
                  <ExpansionCard.Title as="h3" size="small">
                    <HStack align="center" gap="1">
                      <PersonEnvelopeIcon />
                      {`${formaterNavn(personInfo?.navn)} | ${personInfo?.fnr}`}
                    </HStack>
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
            </Box>
          </div>
          <Box marginInline="2 3">
            <Heading size="small" level="2" spacing>
              Journalpost
            </Heading>
            <TextField
              label="Dokumenttittel"
              description="Tittelen blir synlig i fagsystemer og for bruker"
              size="small"
              value={journalpostTittel}
              onChange={(e) => setJournalpostTittel(e.target.value)}
            />
          </Box>

          <Dokumenter dokumenter={journalpost?.dokumenter || []} />
          {saksoversikt?.hotsakSaker && saksoversikt.hotsakSaker.length > 0 && (
            <KnyttTilEksisterendeSak
              åpneSaker={saksoversikt?.hotsakSaker || []}
              valgtEksisterendeSakId={valgtEksisterendeSakId}
              onChange={setValgtEksisterendeSakId}
            />
          )}
          <Box paddingBlock="1 0">
            <Button
              type="submit"
              variant="primary"
              size="small"
              onClick={(e) => {
                e.preventDefault()
                journalfør()
              }}
              disabled={journalfører}
              loading={journalfører}
            >
              {valgtEksisterendeSakId !== '' ? 'Journalfør og knytt til sak' : 'Journalfør og opprett sak'}
            </Button>
          </Box>
        </VStack>
      </form>
    </Container>
  )
}

const Container = styled.div`
  overflow: auto;
  border-right: 1px solid var(--a-border-default);
  padding-top: var(--a-spacing-4);
  padding-right: var(--a-spacing-4);
`

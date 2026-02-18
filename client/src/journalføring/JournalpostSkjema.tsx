import { PersonEnvelopeIcon } from '@navikt/aksel-icons'
import { Box, Button, ExpansionCard, Heading, HStack, TextField, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'
import styled from 'styled-components'

import { Dokumenter } from '../dokument/Dokumenter.tsx'
import { Kolonner } from '../felleskomponenter/Kolonner.tsx'
import { Toast } from '../felleskomponenter/toast/Toast.tsx'
import { erOppgaveIdNull } from '../oppgave/oppgaveTypes.ts'
import { usePersonContext } from '../personoversikt/PersonContext.tsx'
import { usePerson } from '../personoversikt/usePerson.ts'
import { useSaksoversikt } from '../personoversikt/useSaksoversikt.ts'
import { useJournalpost } from '../saksbilde/useJournalpost.ts'
import { BehandlingstatusType, JournalføringRequest, Sakstype } from '../types/types.internal.ts'
import { formaterNavn } from '../utils/formater.ts'
import { JournalføringMenu } from './JournalføringMenu.tsx'
import { KnyttTilEksisterendeSak } from './KnyttTilEksisterendeSak.tsx'
import { useJournalføringActions } from './useJournalføringActions.ts'

export interface JournalpostSkjemaProps {
  journalpostId: string
}

export function JournalpostSkjema({ journalpostId }: JournalpostSkjemaProps) {
  const navigate = useNavigate()
  const { journalpost, isLoading, mutate } = useJournalpost(journalpostId)
  const journalføringActions = useJournalføringActions()
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const [valgtEksisterendeSakId, setValgtEksisterendeSakId] = useState('')
  const [journalføresPåFnr, setJournalføresPåFnr] = useState('')
  const { isLoading: henterPerson, personInfo } = usePerson(fodselsnummer)
  const { saksoversikt } = useSaksoversikt(fodselsnummer, BehandlingstatusType.ÅPEN, Sakstype.BARNEBRILLER)
  const [journalpostTittel, setJournalpostTittel] = useState(journalpost?.tittel || '')

  const journalfør = () => {
    const journalføringRequest: JournalføringRequest = {
      journalpostId: journalpost!.journalpostId,
      tittel: journalpostTittel,
      journalføresPåFnr: fodselsnummer,
      sakId: valgtEksisterendeSakId !== '' ? valgtEksisterendeSakId : undefined,
      oppgaveId: journalpost!.oppgave.oppgaveId,
    }
    journalføringActions.journalfør(journalføringRequest).then((response) => {
      // todo -> dette blir det eneste caset på sikt, men backend (og mock) er ikke klar ennå
      if (response?.oppgaveId && !erOppgaveIdNull(response.oppgaveId)) {
        return navigate(`/oppgave/${response.oppgaveId}`)
      }
      if (response?.sakId) {
        return navigate(`/oppgave/S-${response.sakId}`)
      }
      throw new Error('Klarte ikke å opprette behandle sak-oppgave og/eller sak')
    })
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
        <VStack gap="space-24">
          <div>
            <Heading size="small" level="2" spacing>
              Bruker
            </Heading>

            <Box paddingInline="space-4 space-12">
              <ExpansionCard size="small" aria-label="Bruker det skal journalføres på">
                <ExpansionCard.Header>
                  <ExpansionCard.Title as="h3" size="small">
                    <HStack align="center" gap="space-4">
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
          <Box marginInline="space-8 space-12">
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
          {saksoversikt?.saker && saksoversikt.saker.length > 0 && (
            <KnyttTilEksisterendeSak
              åpneSaker={saksoversikt?.saker || []}
              valgtEksisterendeSakId={valgtEksisterendeSakId}
              onChange={setValgtEksisterendeSakId}
            />
          )}
          <Box paddingBlock="space-4 space-0">
            <Button
              type="submit"
              variant="primary"
              size="small"
              onClick={(e) => {
                e.preventDefault()
                journalfør()
              }}
              disabled={journalføringActions.state.loading}
              loading={journalføringActions.state.loading}
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
  border-right: 1px solid var(--ax-border-neutral-subtle);
  padding-top: var(--ax-space-16);
  padding-right: var(--ax-space-16);
`

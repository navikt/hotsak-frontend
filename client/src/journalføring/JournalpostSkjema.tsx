import { PersonEnvelopeIcon } from '@navikt/aksel-icons'
import { Box, Button, Heading, HStack, TextField, VStack } from '@navikt/ds-react'
import { useState } from 'react'
import { useNavigate } from 'react-router'

import { Dokumenter } from '../dokument/Dokumenter.tsx'
import { Kolonner } from '../felleskomponenter/Kolonner.tsx'
import { CompactExpandableCard } from '../felleskomponenter/panel/CompactExpandableCard.tsx'
import { type Journalføringsoppgave } from '../oppgave/oppgaveTypes.ts'
import { usePersonContext } from '../personoversikt/PersonContext.tsx'
import { useSaksoversikt } from '../personoversikt/useSaksoversikt.ts'
import { type Journalpost, type Person, SaksstatusKategori, Sakstype } from '../types/types.internal.ts'
import { formaterNavn } from '../utils/formater.ts'
import { JournalføringMenu } from './JournalføringMenu.tsx'
import { KnyttTilEksisterendeSak } from './KnyttTilEksisterendeSak.tsx'
import { useJournalføringActions } from './useJournalføringActions.ts'

export interface JournalpostSkjemaProps {
  oppgave: Journalføringsoppgave
  journalpost: Journalpost
  personInfo: Person
  mutateJournalpost(): void
}

export function JournalpostSkjema({ oppgave, journalpost, personInfo, mutateJournalpost }: JournalpostSkjemaProps) {
  const navigate = useNavigate()
  const journalføringActions = useJournalføringActions(oppgave)
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const [valgtEksisterendeSakId, setValgtEksisterendeSakId] = useState('')
  const [journalføresPåFnr, setJournalføresPåFnr] = useState('')
  const { saksoversikt } = useSaksoversikt(fodselsnummer, SaksstatusKategori.ÅPEN, Sakstype.BARNEBRILLER)
  const [journalpostTittel, setJournalpostTittel] = useState(journalpost.tittel || '')

  const journalfør = () => {
    journalføringActions
      .journalfør({
        journalpostId: journalpost.journalpostId,
        tittel: journalpostTittel,
        journalføresPåFnr: fodselsnummer,
        sakId: valgtEksisterendeSakId !== '' ? valgtEksisterendeSakId : undefined,
      })
      .then((response) => {
        if (!response) {
          throw new Error('Klarte ikke å opprette behandle sak-oppgave og/eller sak')
        }
        return navigate(`/oppgave/${response.oppgaveId}`)
      })
  }

  return (
    <>
      <JournalføringMenu oppgave={oppgave} onAction={mutateJournalpost} />
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
              <CompactExpandableCard
                variant="default"
                defaultOpen={false}
                tittel={
                  <HStack align="center" gap="space-4">
                    <PersonEnvelopeIcon aria-hidden />
                    {`${formaterNavn(personInfo.navn)} | ${personInfo.fnr}`}
                  </HStack>
                }
              >
                <Box background="default" paddingBlock="space-12" paddingInline="space-12 space-0">
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
                    >
                      Endre bruker
                    </Button>
                  </Kolonner>
                </Box>
              </CompactExpandableCard>
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

          <Dokumenter dokumenter={journalpost.dokumenter} />
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
    </>
  )
}

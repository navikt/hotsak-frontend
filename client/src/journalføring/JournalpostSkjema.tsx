import { PersonEnvelopeIcon } from '@navikt/aksel-icons'
import { Box, Button, Heading, HStack, TextField, VStack } from '@navikt/ds-react'
import { MouseEventHandler, useState } from 'react'
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
import { Sakstype as Fagsakstype } from './journalføringTypes.ts'
import { KnyttTilEksisterendeSak } from './KnyttTilEksisterendeSak.tsx'
import type { UseJournalføringActionsResponse } from './useJournalføringActions.ts'

export interface JournalpostSkjemaProps {
  oppgave: Journalføringsoppgave
  journalpost: Journalpost
  personInfo: Person
  journalfør: UseJournalføringActionsResponse['journalfør']
  mutateJournalpost(): void
}

export function JournalpostSkjema({
  oppgave,
  journalpost,
  personInfo,
  journalfør,
  mutateJournalpost,
}: JournalpostSkjemaProps) {
  const navigate = useNavigate()
  const { fodselsnummer, setFodselsnummer } = usePersonContext()
  const [valgtEksisterendeSakId, setValgtEksisterendeSakId] = useState('')
  const [journalføresPåFnr, setJournalføresPåFnr] = useState('')
  const { saksoversikt } = useSaksoversikt(fodselsnummer, SaksstatusKategori.ÅPEN, Sakstype.BARNEBRILLER)
  const [journalpostTittel, setJournalpostTittel] = useState(journalpost.tittel || '')

  const handleJournalfør: MouseEventHandler<HTMLButtonElement> = (event) => {
    event.preventDefault()
    journalfør
      .trigger({
        tittel: journalpostTittel,
        journalføresPåFnr: fodselsnummer,
        sak:
          valgtEksisterendeSakId !== ''
            ? {
                fagsakId: valgtEksisterendeSakId,
                sakstype: Fagsakstype.FAGSAK,
                fagsaksystem: 'HOTSAK',
              }
            : undefined,
      })
      .then((response) => {
        let oppgaveId = (response as any).oppgaveId // finnes i v1-responsen
        if (oppgaveId) {
          navigate(`/oppgave/${oppgaveId}`)
          return
        }
        const oppgaver = response.oppgaver?.filter((oppgave) => oppgave.isÅpen)
        if (oppgaver[0]) {
          navigate(`/oppgave/${oppgaver[0].oppgaveId}`)
        }
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
              onClick={handleJournalfør}
              disabled={journalfør.isMutating}
              loading={journalfør.isMutating}
            >
              {valgtEksisterendeSakId !== '' ? 'Journalfør og koble til sak' : 'Journalfør og opprett sak'}
            </Button>
          </Box>
        </VStack>
      </form>
    </>
  )
}

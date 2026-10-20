import { BodyShort, Box, Button, ErrorMessage, HStack, Label, TextField, VStack } from '@navikt/ds-react'

import { InlineKopiknapp } from '../felleskomponenter/Kopiknapp.tsx'
import { TextContainer } from '../felleskomponenter/typografi.tsx'
import { usePersonContext } from '../personoversikt/PersonContext.tsx'
import { type Journalpost } from '../types/types.internal.ts'
import { useJournalføringPart } from './useJournalføringPart.ts'

interface JournalføringParterProps {
  journalpost: Journalpost
  tildeltEnhet: string
  kanRedigere: boolean
  avsenderFnr: string
  onAvsenderChange(fnr: string): void
  onBrukerChange(fnr: string): void
}

interface PartFeltProps {
  label: string
  srLabel: string
  inputLabel: string
  velgLabel: string
  fnr: string
  kanRedigere: boolean
  part: ReturnType<typeof useJournalføringPart>
}

export function JournalføringParter({
  journalpost,
  kanRedigere,
  avsenderFnr,
  onAvsenderChange,
  onBrukerChange,
}: JournalføringParterProps) {
  const { fodselsnummer } = usePersonContext()
  const bruker = useJournalføringPart({
    part: 'Bruker',
    fnr: fodselsnummer,
    onChange: onBrukerChange,
    opprinneligFnr: journalpost.fnrBruker,
    opprinneligNavn: journalpost.bruker?.navn,
  })
  const avsender = useJournalføringPart({
    part: 'Avsender',
    fnr: avsenderFnr,
    onChange: onAvsenderChange,
    opprinneligFnr: journalpost.fnrInnsender,
    opprinneligNavn: journalpost.innsender.navn,
  })

  return (
    <TextContainer>
      <VStack gap="space-8">
        <PartFelt
          label="Bruker"
          srLabel="bruker"
          inputLabel="Fødselsnummer"
          velgLabel="Velg"
          fnr={fodselsnummer}
          kanRedigere={kanRedigere}
          part={bruker}
        />
        <PartFelt
          label="Avsender"
          srLabel="avsender"
          inputLabel="Avsenders fødselsnummer"
          velgLabel="Velg avsender"
          fnr={avsenderFnr}
          kanRedigere={kanRedigere}
          part={avsender}
        />
      </VStack>
    </TextContainer>
  )
}

function PartFelt({ label, srLabel, inputLabel, velgLabel, fnr, kanRedigere, part }: PartFeltProps) {
  return (
    <Box borderRadius="12" borderWidth="1" borderColor="neutral-subtle" padding="space-12">
      <HStack justify="space-between" align="start">
        <VStack gap="space-4">
          <Label size="small">{label}</Label>
          {part.redigerer ? (
            <VStack gap="space-4">
              <HStack gap="space-12" align="end">
                <TextField
                  label={inputLabel}
                  size="small"
                  value={part.inputFnr}
                  onChange={(e) => part.setInputFnr(e.target.value)}
                  autoFocus
                />
                <HStack gap="space-4">
                  <Button variant="primary" size="small" type="button" loading={part.laster} onClick={part.velg}>
                    {velgLabel}
                  </Button>
                  <Button variant="secondary" size="small" type="button" onClick={part.avbrytRedigering}>
                    Avbryt
                  </Button>
                </HStack>
              </HStack>
              {part.feil && <ErrorMessage size="small">{part.feil}</ErrorMessage>}
            </VStack>
          ) : (
            <HStack gap="space-1" align="center">
              <BodyShort size="small">{`${part.navn} - ${fnr}`}</BodyShort>
              <InlineKopiknapp copyText={fnr} tooltip="Kopier fødselsnummer" />
            </HStack>
          )}
        </VStack>
        {kanRedigere && !part.redigerer && (
          <Button variant="tertiary" size="xsmall" type="button" onClick={part.startRedigering}>
            Endre <span className="sr-only">{srLabel}</span>
          </Button>
        )}
      </HStack>
    </Box>
  )
}

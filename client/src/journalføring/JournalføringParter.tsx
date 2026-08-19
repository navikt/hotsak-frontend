import { BodyShort, Box, Button, ErrorMessage, HStack, Label, TextField, VStack, Detail } from '@navikt/ds-react'
import { useState } from 'react'

import { InlineKopiknapp } from '../felleskomponenter/Kopiknapp.tsx'
import { http } from '../io/HttpClient.ts'
import { usePerson } from '../personoversikt/usePerson.ts'
import { type Journalpost, type Person } from '../types/types.internal.ts'
import { formaterNavn } from '../utils/formater.ts'
import { useFormContext } from 'react-hook-form'
import { type JournalføringV2SkjemaVerdier } from './journalføringTypes.ts'

interface JournalføringParterProps {
  journalpost: Journalpost
  tildeltEnhet: string
  kanRedigere: boolean
}

export function JournalføringParter({ journalpost, tildeltEnhet, kanRedigere }: JournalføringParterProps) {
  const { watch, setValue } = useFormContext<JournalføringV2SkjemaVerdier>()
  const journalføresPåFnr = watch('journalføresPåFnr')

  const [redigererBruker, setRedigererBruker] = useState(false)
  const [brukerInputFnr, setBrukerInputFnr] = useState('')
  const [brukerFeil, setBrukerFeil] = useState<string | null>(null)
  const [oppslagLaster, setOppslagLaster] = useState(false)

  const { personInfo: valgtBruker } = usePerson(journalføresPåFnr || undefined)

  const brukerNavn = valgtBruker
    ? formaterNavn(valgtBruker.navn)
    : journalpost.bruker
      ? formaterNavn(journalpost.bruker.navn)
      : ''
  const brukerFnr = valgtBruker?.fnr ?? journalføresPåFnr

  function visBrukerIkkeFunnet() {
    setBrukerFeil('Bruker ikke funnet i PDL')
    setBrukerInputFnr('')
  }

  async function velgBruker() {
    const fnr = brukerInputFnr.trim()
    setBrukerFeil(null)
    if (!fnr) {
      visBrukerIkkeFunnet()
      return
    }
    setOppslagLaster(true)
    try {
      //TODO gjør dette fra en hook
      const person = await http.post<{ fnr: string }, Person>('/api/person', { fnr })
      if (!person) {
        visBrukerIkkeFunnet()
        return
      }
      setValue('journalføresPåFnr', person.fnr, { shouldDirty: true })
      setBrukerInputFnr('')
      setRedigererBruker(false)
    } catch {
      visBrukerIkkeFunnet()
    } finally {
      setOppslagLaster(false)
    }
  }

  function avbrytRedigering() {
    setRedigererBruker(false)
    setBrukerFeil(null)
    setBrukerInputFnr('')
  }

  return (
    <VStack gap="space-8">
      <Box borderRadius="12" borderWidth="1" borderColor="neutral-subtle" padding="space-12">
        <HStack justify="space-between" align="start">
          <VStack gap="space-12">
            <VStack gap="space-4">
              <Label size="small">Bruker</Label>
              {redigererBruker ? (
                <VStack gap="space-4">
                  <HStack gap="space-12" align="end">
                    <TextField
                      label="Fødselsnummer"
                      size="small"
                      value={brukerInputFnr}
                      onChange={(e) => setBrukerInputFnr(e.target.value)}
                      autoFocus
                    />
                    <HStack gap="space-4">
                      <Button variant="primary" size="small" type="button" loading={oppslagLaster} onClick={velgBruker}>
                        Velg
                      </Button>
                      <Button variant="secondary" size="small" type="button" onClick={avbrytRedigering}>
                        Avbryt
                      </Button>
                    </HStack>
                  </HStack>
                  {brukerFeil && <ErrorMessage size="small">{brukerFeil}</ErrorMessage>}
                </VStack>
              ) : (
                <HStack gap="space-1" align="center">
                  <BodyShort size="small">{brukerNavn} - </BodyShort>
                  <BodyShort size="small">{brukerFnr}</BodyShort>
                  <InlineKopiknapp copyText={brukerFnr} tooltip="Kopier fødselsnummer" />
                </HStack>
              )}
            </VStack>
            <BodyShort size="small">{tildeltEnhet}</BodyShort>
          </VStack>
          {kanRedigere &&
            (redigererBruker ? null : (
              <Button
                variant="tertiary"
                size="xsmall"
                type="button"
                onClick={() => {
                  setRedigererBruker(true)
                  setBrukerFeil(null)
                  setBrukerInputFnr(brukerFnr)
                }}
              >
                Endre
              </Button>
            ))}
        </HStack>
      </Box>

      <Box borderRadius="12" borderWidth="1" borderColor="neutral-subtle" padding="space-12">
        <HStack justify="space-between" align="start">
          <VStack gap="space-4">
            <VStack gap="space-2">
              <Label size="small">Avsender</Label>
              <Detail>Avsender er bruker</Detail>
            </VStack>
            <HStack gap="space-1" align="center">
              <BodyShort size="small">{brukerNavn} - </BodyShort>
              <BodyShort size="small">{brukerFnr}</BodyShort>
              <InlineKopiknapp copyText={brukerFnr} tooltip="Kopier fødselsnummer" />
            </HStack>
          </VStack>
        </HStack>
      </Box>
    </VStack>
  )
}

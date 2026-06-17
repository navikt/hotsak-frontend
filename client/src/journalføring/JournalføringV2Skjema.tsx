import {
  BodyShort,
  Box,
  Button,
  DatePicker,
  Heading,
  HStack,
  Label,
  Radio,
  RadioGroup,
  Select,
  Tag,
  Textarea,
  useDatepicker,
  VStack,
} from '@navikt/ds-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { InlineKopiknapp } from '../felleskomponenter/Kopiknapp.tsx'
import { Skillelinje } from '../felleskomponenter/Strek.tsx'
import { type Journalføringsoppgave } from '../oppgave/oppgaveTypes.ts'
import { AvrundetPanel } from '../sak/v2/paneler/AvrundetPanel.tsx'
import { type Dokument, type Journalpost } from '../types/types.internal.ts'
import { formaterDato } from '../utils/dato.ts'
import { formaterNavn } from '../utils/formater.ts'
import { DokumentRad } from './DokumentRad.tsx'

interface JournalføringV2SkjemaVerdier {
  tema: string
  stønadsklassifisering: string
  stønadsUnderkategori: string
  stønadType: string
  gjelder: string
  prioritet: string
  kommentar: string
  mottattDato: string
  aktivFra: string
  frist: string
  tilordnetEnhet: 'annenEnhet' | 'minEnhet' | 'minOppgaveliste'
  enhetsmappe: string
}

interface JournalføringV2SkjemaProps {
  oppgave: Journalføringsoppgave
  journalpost: Journalpost
}

export function JournalføringV2Skjema({ oppgave, journalpost }: JournalføringV2SkjemaProps) {
  const [sakType, setSakType] = useState<'ny' | 'eksisterende'>('ny')
  const [dokumentTitler, setDokumentTitler] = useState<Record<string, string>>({})
  const [annetInnhold, setAnnetInnhold] = useState<Record<string, string[]>>({})
  console.log(oppgave.oppgaveId)
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<JournalføringV2SkjemaVerdier>({
    defaultValues: {
      tema: 'HJE',
      prioritet: 'NORMAL',
      tilordnetEnhet: 'minEnhet',
      kommentar: `Tittel: ${journalpost.tittel}\nRegistrert dato: ${formaterDato(journalpost.journalpostOpprettetTid)}`,
    },
  })

  const { datepickerProps: mottattProps, inputProps: mottattInputProps } = useDatepicker({})
  const { datepickerProps: aktivFraProps, inputProps: aktivFraInputProps } = useDatepicker({})
  const { datepickerProps: fristProps, inputProps: fristInputProps } = useDatepicker({})

  const onSubmit = (/*_verdier: JournalføringV2SkjemaVerdier*/) => {
    // API-kall settes opp senere
  }

  const brukerNavn = journalpost.bruker ? formaterNavn(journalpost.bruker.navn) : ''
  const brukerFnr = journalpost.bruker?.fnr ?? journalpost.fnrInnsender
  const avsenderNavn = journalpost.innsender ? formaterNavn(journalpost.innsender.navn) : ''
  const avsenderFnr = journalpost.innsender?.fnr ?? ''
  const registrertDato = formaterDato(journalpost.journalpostOpprettetTid)

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <VStack gap="space-16">
        <Heading level="1" size="xsmall">
          Journalføring
        </Heading>
        <div>
          <HStack gap="space-12" paddingBlock="space-0">
            <BodyShort size="small">
              <strong>Kilde:</strong> nav.no
            </BodyShort>
            <BodyShort size="small">
              <strong>Registrert dato:</strong> {registrertDato}
            </BodyShort>
          </HStack>
          <Skillelinje />
        </div>

        <VStack gap="space-8">
          <Heading level="2" size="small">
            Gjelder
          </Heading>

          <Select label="Tema" size="small" {...register('tema')}>
            <option value="HJE">Hjelpemidler</option>
          </Select>

          <AvrundetPanel>
            <HStack justify="space-between" align="start">
              <VStack gap="space-1">
                <Label size="small">Bruker</Label>
                <HStack gap="space-1" align="center">
                  <BodyShort size="small">{brukerNavn}</BodyShort>
                  <BodyShort size="small"> - {brukerFnr}</BodyShort>
                  <InlineKopiknapp copyText={brukerFnr} tooltip="Kopier fødselsnummer" />
                </HStack>
                <BodyShort size="small">Nav Hobsyssel - 0523</BodyShort>
              </VStack>
              <Button variant="tertiary" size="xsmall" type="button">
                Endre
              </Button>
            </HStack>
          </AvrundetPanel>

          <AvrundetPanel>
            <HStack justify="space-between" align="start">
              <VStack gap="space-1">
                <Label size="small">Avsender</Label>
                <HStack gap="space-1" align="center">
                  <BodyShort size="small">{avsenderNavn}</BodyShort>
                  <BodyShort size="small"> - {avsenderFnr}</BodyShort>
                  <InlineKopiknapp copyText={avsenderFnr} tooltip="Kopier fødselsnummer" />
                </HStack>
                <BodyShort size="small">Nav Hobsyssel - 0523</BodyShort>
              </VStack>
              <Button variant="tertiary" size="xsmall" type="button">
                Endre
              </Button>
            </HStack>
          </AvrundetPanel>
        </VStack>

        {/* Dokumenter
        TODO: Kan kanskje gjenbruke noe for briller for dokumentrad? Eller bare få barnebriller over til nytt journalføringsbilde?
        */}
        <VStack gap="space-8">
          <Heading level="2" size="small">
            Dokumenter
          </Heading>
          {journalpost.dokumenter.map((dok: Dokument, idx: number) => (
            <DokumentRad
              key={dok.dokumentId}
              dokument={dok}
              index={idx}
              total={journalpost.dokumenter.length}
              valgtTittel={dokumentTitler[dok.dokumentId] ?? dok.tittel}
              onTittelChange={(tittel) => setDokumentTitler((prev) => ({ ...prev, [dok.dokumentId]: tittel }))}
              valgteChips={annetInnhold[dok.dokumentId] ?? []}
              onChipsChange={(chips) => setAnnetInnhold((prev) => ({ ...prev, [dok.dokumentId]: chips }))}
            />
          ))}
        </VStack>

        {/* Ny eller eksisterende sak */}
        <VStack gap="space-8">
          <Heading level="2" size="xsmall">
            Ny eller eksisterende sak
          </Heading>
          <HStack gap="space-2">
            <Button
              type="button"
              size="small"
              variant={sakType === 'ny' ? 'primary' : 'secondary'}
              onClick={() => setSakType('ny')}
            >
              Opprett ny sak
            </Button>
            <Button
              type="button"
              size="small"
              variant={sakType === 'eksisterende' ? 'primary' : 'secondary'}
              onClick={() => setSakType('eksisterende')}
              icon={
                <Tag variant="warning" size="xsmall">
                  2 åpne
                </Tag>
              }
              iconPosition="right"
            >
              Koble til sak
            </Button>
          </HStack>
        </VStack>

        {/* Opprett ny sak i Hotsak */}
        {sakType === 'ny' && (
          <VStack gap="space-12">
            <Heading level="2" size="medium">
              Opprett ny sak i Hotsak
            </Heading>

            <HStack gap="space-16">
              <VStack gap="space-1">
                <Label size="small">Tema</Label>
                <BodyShort size="small">HJE</BodyShort>
              </VStack>
              <VStack gap="space-1">
                <Label size="small">Oppgavetype</Label>
                <BodyShort size="small">Behandle sak</BodyShort>
              </VStack>
            </HStack>

            {/* Stønadsklassifisering */}
            <VStack gap="space-2">
              <Label size="small">Stønadsklassifisering</Label>
              <HStack gap="space-2" align="end">
                <Select label="Stønadsklassifisering" hideLabel size="small" {...register('stønadsklassifisering')}>
                  <option value="DAGLIGLIV">Dagligliv</option>
                  <option value="FORFLYTNING">Forflytning</option>
                </Select>
                <Select label="Underkategori" hideLabel size="small" {...register('stønadsUnderkategori')}>
                  <option value="">Velg</option>
                </Select>
                <Select label="Stønadtype" hideLabel size="small" {...register('stønadType')}>
                  <option value="SOKNAD">Søknad</option>
                  <option value="BESTILLING">Bestilling</option>
                </Select>
              </HStack>
            </VStack>

            <HStack gap="space-4" align="start">
              <Select label="Gjelder" size="small" {...register('gjelder')} style={{ flex: 2 }}>
                <option value="">Velg</option>
                <option value="MANUELL_RULLESTOL">Manuell rullestol | Dagligliv</option>
              </Select>
              <Select label="Prioritet" size="small" {...register('prioritet')} style={{ flex: 1 }}>
                <option value="NORMAL">Normal</option>
                <option value="HOY">Høy</option>
                <option value="KRITISK">Kritisk</option>
              </Select>
            </HStack>

            <Controller
              name="kommentar"
              control={control}
              render={({ field }) => (
                <Textarea
                  label="Kommentar"
                  size="small"
                  maxLength={1000}
                  {...field}
                  error={errors.kommentar?.message}
                />
              )}
            />

            <HStack gap="space-4" align="start">
              <DatePicker {...mottattProps}>
                <DatePicker.Input {...mottattInputProps} label="Mottatt dato" size="small" />
              </DatePicker>
              <DatePicker {...aktivFraProps}>
                <DatePicker.Input {...aktivFraInputProps} label="Aktiv fra" size="small" />
              </DatePicker>
              <DatePicker {...fristProps}>
                <DatePicker.Input {...fristInputProps} label="Frist" size="small" />
              </DatePicker>
            </HStack>

            {/* Tilordne oppgave */}
            <VStack gap="space-4">
              <Label size="small">Tilordne oppgave</Label>
              <BodyShort size="small">Foreslått: 4714 - Nav hjelpemiddelsentral Vestland-Førde</BodyShort>
              <Controller
                name="tilordnetEnhet"
                control={control}
                render={({ field }) => (
                  <RadioGroup
                    legend="Tilordne oppgave"
                    hideLegend
                    size="small"
                    value={field.value}
                    onChange={field.onChange}
                  >
                    <Radio value="annenEnhet">Velg annen enhet</Radio>
                    <Radio value="minEnhet">Min enhet: 2990 - Nav hjelpemiddelsentral Testeland</Radio>
                    {field.value === 'minEnhet' && (
                      <Box paddingInline="space-32 space-0">
                        <Select label="Enhetsmappe" size="small" {...register('enhetsmappe')}>
                          <option value="">Ingen mappe</option>
                        </Select>
                      </Box>
                    )}
                    <Radio value="minOppgaveliste">Min oppgaveliste: 2990 | Silje Saksehandler</Radio>
                  </RadioGroup>
                )}
              />
            </VStack>
          </VStack>
        )}

        {/* Handlingsknapper */}
        <HStack gap="space-4" paddingBlock="space-8 space-0">
          <Button type="submit" variant="primary" size="small">
            Journalfør og opprett sak
          </Button>
          <Button type="button" variant="secondary" size="small">
            Lagre utkast
          </Button>
          <Button type="button" variant="secondary" size="small">
            Overfør til Gosys
          </Button>
        </HStack>
      </VStack>
    </form>
  )
}

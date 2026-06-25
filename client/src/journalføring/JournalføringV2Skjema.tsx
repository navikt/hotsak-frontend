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
  Textarea,
  ToggleGroup,
  useDatepicker,
  VStack,
} from '@navikt/ds-react'
import { addWeeks, formatISO, isAfter, parseISO } from 'date-fns'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { InlineKopiknapp } from '../felleskomponenter/Kopiknapp.tsx'
import { Skillelinje } from '../felleskomponenter/Strek.tsx'
import { SelectController } from '../felleskomponenter/skjema/SelectController.tsx'
import { TextContainer } from '../felleskomponenter/typografi.tsx'
import { usePost } from '../io/usePost.ts'
import { type Journalføringsoppgave } from '../oppgave/oppgaveTypes.ts'
import { harBehandlingstema, useKodeverkBehandlingstyper, useKodeverkGjelder } from '../oppgave/useKodeverkOppgave.ts'
import { type Dokument, type Journalpost } from '../types/types.internal.ts'
import { formaterDato } from '../utils/dato.ts'
import { formaterNavn } from '../utils/formater.ts'
import { DokumentRad } from './DokumentRad.tsx'
import { type JournalføringV2Request, type JournalføringV2Response } from './journalføringTypes.ts'
import { useOppgavebehandlere } from '../oppgave/useOppgavebehandlere.ts'

interface JournalføringV2SkjemaVerdier {
  tema: string
  behandlingstype: string
  behandlingstema: string
  stønadsklassifisering: string
  stønadsUnderkategori: string
  stønadType: string
  prioritet: string
  kommentar: string
  mottattDato: string
  aktivFra: string
  frist: string
  tilordnetEnhet: 'minOppgaveliste' | 'enhetensOppgaveliste' | 'medarbeidersOppgaveliste'
  enhetsmappe: string
  medarbeider: string
}

interface JournalføringV2SkjemaProps {
  oppgave: Journalføringsoppgave
  journalpost: Journalpost
}

export function JournalføringV2Skjema({ oppgave, journalpost }: JournalføringV2SkjemaProps) {
  const [sakType, setSakType] = useState<string>('ny')
  const [dokumentTitler, setDokumentTitler] = useState<Record<string, string>>({})
  const [annetInnhold, setAnnetInnhold] = useState<Record<string, string[]>>({})
  const { behandlere } = useOppgavebehandlere()
  const mottattDatoDefault = parseISO(journalpost.journalpostOpprettetTid)
  const fristDefault = addWeeks(mottattDatoDefault, 4)

  const behandlingstyper = useKodeverkBehandlingstyper()

  const { post } = usePost<JournalføringV2Request, JournalføringV2Response>(
    `/api/journalpost/${journalpost.journalpostId}/journalforing`
  )

  const {
    register,
    handleSubmit,
    control,
    setValue,
    getValues,
    watch,
    trigger,
    formState: { errors },
  } = useForm<JournalføringV2SkjemaVerdier>({
    defaultValues: {
      tema: 'HJE',
      prioritet: 'NORMAL',
      tilordnetEnhet: 'enhetensOppgaveliste',
      kommentar: ``,
      mottattDato: formatISO(mottattDatoDefault, { representation: 'date' }),
      aktivFra: formatISO(mottattDatoDefault, { representation: 'date' }),
      frist: formatISO(fristDefault, { representation: 'date' }),
    },
  })

  const valgtBehandlingstype = watch('behandlingstype')
  const gjelderOptions = useKodeverkGjelder(valgtBehandlingstype || undefined).filter(harBehandlingstema)

  // Registrer datofelt manuelt for validering (ingen DOM-ref siden Aksel håndterer input)
  useEffect(() => {
    register('mottattDato')
    register('frist')
    register('aktivFra', {
      validate: (value) => {
        const fristVerdi = getValues('frist')
        if (value && fristVerdi && isAfter(parseISO(value), parseISO(fristVerdi))) {
          return 'Aktiv fra kan ikke være etter fristen'
        }
        return true
      },
    })
  }, [register, getValues])

  const { datepickerProps: mottattProps, inputProps: mottattInputProps } = useDatepicker({
    defaultSelected: mottattDatoDefault,
    onDateChange: (dato) => {
      if (dato) {
        const datoStr = formatISO(dato, { representation: 'date' })
        setValue('mottattDato', datoStr)
        setAktivFra(dato)
        setValue('aktivFra', datoStr, { shouldValidate: true })
        const nyFrist = addWeeks(dato, 4)
        setFrist(nyFrist)
        setValue('frist', formatISO(nyFrist, { representation: 'date' }), { shouldValidate: true })
      }
    },
  })

  const {
    datepickerProps: aktivFraProps,
    inputProps: aktivFraInputProps,
    setSelected: setAktivFra,
  } = useDatepicker({
    defaultSelected: mottattDatoDefault,
    onDateChange: (dato) => {
      if (dato) {
        setValue('aktivFra', formatISO(dato, { representation: 'date' }), { shouldValidate: true })
      }
    },
  })

  const {
    datepickerProps: fristProps,
    inputProps: fristInputProps,
    setSelected: setFrist,
  } = useDatepicker({
    defaultSelected: fristDefault,
    onDateChange: (dato) => {
      if (dato) {
        setValue('frist', formatISO(dato, { representation: 'date' }))
        trigger('aktivFra')
      }
    },
  })

  const onSubmit = (verdier: JournalføringV2SkjemaVerdier) => {
    const payload: JournalføringV2Request = {
      saksgrunnlag: {
        tema: verdier.tema,
        prioritet: verdier.prioritet,
        oppgavetype: 'BEHANDLE_SAK',
        behandlingstype: verdier.behandlingstype,
        behandlingstema: verdier.behandlingstema,
        stønadsklassifisering: verdier.stønadsklassifisering,
        stønad: verdier.stønadType,
        kommentar: verdier.kommentar,
        mottattDato: verdier.mottattDato,
        aktivDato: verdier.aktivFra,
        fristDato: verdier.frist,
        tildeltEnhet: oppgave.tildeltEnhet.nummer,
        tildeltSaksbehandler: verdier.tilordnetEnhet === 'enhetensOppgaveliste' ? verdier.medarbeider : undefined,
      },
      dokumenter: journalpost.dokumenter.map((dok: Dokument) => ({
        dokumentId: dok.dokumentId,
        tittel: dokumentTitler[dok.dokumentId] ?? dok.tittel,
      })),
    }
    post(payload)
  }

  // TODO: Legge inn vertikal ikonlinje med dokumentoversikt, saksoversikt osv?
  // TODO: Sjekk tilgang og lag lesevisning

  const brukerNavn = journalpost.bruker ? formaterNavn(journalpost.bruker.navn) : ''
  const brukerFnr = journalpost.bruker?.fnr ?? journalpost.fnrInnsender
  const avsenderNavn = journalpost.innsender ? formaterNavn(journalpost.innsender.navn) : ''
  const avsenderFnr = journalpost.innsender?.fnr ?? ''
  const registrertDato = formaterDato(journalpost.journalpostOpprettetTid)

  const tildeltEnhet = `${oppgave.tildeltEnhet.navn} - ${oppgave.tildeltEnhet.nummer}`

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
        <TextContainer>
          <VStack gap="space-8">
            <Heading level="2" size="small">
              Gjelder
            </Heading>

            <SelectController
              control={control}
              name="tema"
              label="Tema"
              size="small"
              rules={{ required: 'Du må velge tema' }}
            >
              <option value="HJE">Hjelpemidler</option>
            </SelectController>

            <Box borderRadius="12" borderWidth="1" borderColor="neutral-subtle" padding="space-12">
              <HStack justify="space-between" align="start">
                <VStack gap="space-1">
                  <Label size="small">Bruker</Label>
                  <HStack gap="space-1" align="center">
                    <BodyShort size="small">{brukerNavn} - </BodyShort>
                    <BodyShort size="small">{brukerFnr}</BodyShort>
                    <InlineKopiknapp copyText={brukerFnr} tooltip="Kopier fødselsnummer" />
                  </HStack>
                  <BodyShort size="small">{tildeltEnhet}</BodyShort>
                </VStack>
                <Button variant="tertiary" size="xsmall" type="button">
                  Endre
                </Button>
              </HStack>
            </Box>

            <Box borderRadius="12" borderWidth="1" borderColor="neutral-subtle" padding="space-12">
              <HStack justify="space-between" align="start">
                <VStack gap="space-1">
                  <Label size="small">Avsender</Label>
                  <HStack gap="space-1" align="center">
                    <BodyShort size="small">{avsenderNavn} - </BodyShort>
                    <BodyShort size="small">{avsenderFnr}</BodyShort>
                    <InlineKopiknapp copyText={avsenderFnr} tooltip="Kopier fødselsnummer" />
                  </HStack>
                  <BodyShort size="small">{tildeltEnhet}</BodyShort>
                </VStack>
                <Button variant="tertiary" size="xsmall" type="button">
                  Endre
                </Button>
              </HStack>
            </Box>
          </VStack>
        </TextContainer>

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

        <VStack gap="space-8" paddingBlock="space-40 space-0">
          <Heading level="2" size="xsmall">
            Ny eller eksisterende sak
          </Heading>
          <HStack gap="space-2">
            <ToggleGroup defaultValue="ny" size="small" onChange={(value) => setSakType(value)} value={sakType}>
              <ToggleGroup.Item value="ny">Opprett ny sak</ToggleGroup.Item>
              <ToggleGroup.Item value="eksisterende">Koble til sak</ToggleGroup.Item>
            </ToggleGroup>
          </HStack>
        </VStack>

        {sakType === 'ny' && (
          <VStack gap="space-20">
            <Heading level="2" size="small">
              Opprett ny sak i Hotsak
            </Heading>

            <HStack gap="space-32">
              <VStack gap="space-1">
                <Label size="small">Tema</Label>
                <BodyShort size="small">HJE</BodyShort>
              </VStack>
              <VStack gap="space-1">
                <Label size="small">Oppgavetype</Label>
                <BodyShort size="small">Behandle sak</BodyShort>
              </VStack>
            </HStack>

            {/* Teste å spitte behandlingstype og behandlingstema */}
            <VStack gap="space-4" align="start">
              <SelectController
                control={control}
                name="behandlingstype"
                label="Behandlingstype"
                size="small"
                rules={{ required: 'Du må velge behandlingstype' }}
                style={{ flex: 2 }}
              >
                <option value="">Velg</option>
                {behandlingstyper.map((bt) => (
                  <option key={bt.kode} value={bt.kode}>
                    {bt.term}
                  </option>
                ))}
              </SelectController>
              <SelectController
                control={control}
                name="behandlingstema"
                label="Behandlingstema"
                size="small"
                rules={{ required: 'Du må velge behandlingstema' }}
                style={{ flex: 2 }}
                disabled={!valgtBehandlingstype}
              >
                <option value="">Velg</option>
                {gjelderOptions.map((g) => (
                  <option key={g.behandlingstema.kode} value={g.behandlingstema.kode}>
                    {g.behandlingstema.term}
                  </option>
                ))}
              </SelectController>
              <SelectController
                control={control}
                name="prioritet"
                label="Prioritet"
                size="small"
                rules={{ required: 'Du må velge prioritet' }}
                style={{ flex: 1 }}
              >
                <option value="KRITISK">Kritisk</option>
                <option value="HOY">Høy</option>
                <option value="NORMAL">Normal</option>
                <option value="LAV">Lav</option>
              </SelectController>
            </VStack>
            {/* Slutt */}

            {/* Stønadsklassifisering */}
            <HStack gap="space-20">
              {/*  <VStack gap="space-8">
                <Label size="small">Stønadsklassifisering</Label>
                <SelectController
                  control={control}
                  name="stønadsklassifisering"
                  label="Stønadsklassifisering"
                  hideLabel
                  size="small"
                  rules={{ required: 'Du må velge stønadsklassifisering' }}
                >
                  <option value="DAGLIGLIV">Dagligliv</option>
                  <option value="FORFLYTNING">Forflytning</option>
                </SelectController>
              </VStack>*/}

              <VStack gap="space-8">
                <Label size="small">Område</Label>
                <SelectController
                  control={control}
                  name="stønadsUnderkategori"
                  label="Underkategori"
                  hideLabel
                  size="small"
                  rules={{ required: 'Du må velge underkategori' }}
                >
                  <option value="">Velg</option>
                </SelectController>
              </VStack>
              <VStack gap="space-8">
                <Label size="small">Stønad</Label>
                <SelectController
                  control={control}
                  name="stønadType"
                  label="Stønadtype"
                  hideLabel
                  size="small"
                  rules={{ required: 'Du må velge stønadtype' }}
                >
                  <option value="SOKNAD">Søknad</option>
                  <option value="BESTILLING">Bestilling</option>
                </SelectController>
              </VStack>
            </HStack>

            <TextContainer>
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
            </TextContainer>

            <HStack gap="space-4" align="start">
              <DatePicker {...mottattProps}>
                <DatePicker.Input {...mottattInputProps} label="Mottatt dato" size="small" />
              </DatePicker>
              <DatePicker {...aktivFraProps}>
                <DatePicker.Input
                  {...aktivFraInputProps}
                  label="Aktiv fra"
                  size="small"
                  error={errors.aktivFra?.message}
                />
              </DatePicker>
              <DatePicker {...fristProps}>
                <DatePicker.Input {...fristInputProps} label="Frist" size="small" />
              </DatePicker>
            </HStack>

            {/* Tilordne oppgave */}
            <VStack gap="space-4" paddingBlock="space-20 space-0">
              <Label size="small">Tilordne oppgave</Label>
              <BodyShort size="small">{tildeltEnhet}</BodyShort>
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
                    <Radio value="minOppgaveliste">Min oppgaveliste</Radio>
                    <Radio value="medarbeidersOppgaveliste">Medarbeiders oppgaveliste</Radio>
                    {field.value === 'medarbeidersOppgaveliste' && (
                      <Box paddingInline="space-32 space-0">
                        <Select label="Enhetsmappe" size="small" {...register('enhetsmappe')}>
                          <option value="">Ingen mappe</option>
                        </Select>
                      </Box>
                    )}
                    <Radio value="enhetensOppgaveliste">Min enhet: {tildeltEnhet}</Radio>
                    {field.value === 'enhetensOppgaveliste' && (
                      <Box paddingInline="space-32 space-0">
                        <Select label="Medarbeider" size="small" {...register('medarbeider')}>
                          <option value="">Velg medarbeider</option>
                          {behandlere.map((behandler) => (
                            <option key={behandler.id} value={behandler.id}>
                              {behandler.navn}
                            </option>
                          ))}
                        </Select>
                      </Box>
                    )}
                  </RadioGroup>
                )}
              />
            </VStack>
          </VStack>
        )}
        {sakType === 'eksisterende' && <div>TODO</div>}

        {/* Handlingsknapper */}
        <HStack gap="space-4" paddingBlock="space-8 space-0">
          <Button type="submit" variant="primary" size="small">
            Journalfør og opprett sak
          </Button>

          <Button type="button" variant="secondary" size="small">
            Overfør til Gosys
          </Button>
        </HStack>
      </VStack>
    </form>
  )
}

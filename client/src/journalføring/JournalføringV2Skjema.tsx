import {
  BodyShort,
  Box,
  Button,
  DatePicker,
  ErrorMessage,
  Heading,
  HStack,
  Label,
  Radio,
  RadioGroup,
  Select,
  TextField,
  Textarea,
  ToggleGroup,
  UNSAFE_Combobox,
  useDatepicker,
  VStack,
  Detail,
} from '@navikt/ds-react'
import { addWeeks, formatISO, isAfter, parseISO } from 'date-fns'
import { type ReactNode, useEffect, useMemo, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { InlineKopiknapp } from '../felleskomponenter/Kopiknapp.tsx'
import { Skillelinje } from '../felleskomponenter/Strek.tsx'
import { SelectController } from '../felleskomponenter/skjema/SelectController.tsx'
import { TextContainer } from '../felleskomponenter/typografi.tsx'
import {
  type Journalføringsoppgave,
  Oppgaveprioritet,
  OppgaveprioritetLabel,
  Oppgavetype,
  OppgavetypeLabel,
} from '../oppgave/oppgaveTypes.ts'
import { stønadsklassifiseringData, stønadstype } from '../oppgave/stønadsklassifiseringData.ts'
import { type GjelderOption, useGjelderOptions } from '../oppgave/useKodeverkOppgave.ts'
import { useOppgaveMapper } from '../oppgave/useOppgave.ts'
import { useOppgavebehandlere } from '../oppgave/useOppgavebehandlere.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { type Dokument, type Journalpost, type Person } from '../types/types.internal.ts'
import { formaterDato } from '../utils/dato.ts'
import { formaterNavn } from '../utils/formater.ts'
import { http } from '../io/HttpClient.ts'
import { usePerson } from '../personoversikt/usePerson.ts'
import { DokumentRad } from './DokumentRad.tsx'
import { JournalføringFerdigModal } from './JournalføringFerdigModal.tsx'
import { JournalføringMenu } from './JournalføringMenu.tsx'
import { KobleTilSakKort } from './KobleTilSakKort.tsx'
import classes from './JournalføringV2Skjema.module.css'
import { type JournalføringV2Response, type SakstypeKode } from './journalføringTypes.ts'
import { useJournalføringActions } from './useJournalføringActions.ts'

interface JournalføringV2SkjemaVerdier {
  tema: string
  behandlingstype: string
  behandlingstema: string
  stønadsklassifisering: string
  stønadsUnderkategori: string
  stønadType: string
  prioritet: Oppgaveprioritet
  kommentar: string
  mottattDato: string
  aktivFra: string
  frist: string
  journalføresPåFnr: string
  tilordnetEnhet: 'minOppgaveliste' | 'enhetensOppgaveliste' | 'medarbeidersOppgaveliste'
  enhetsmappe: string
  medarbeider: string
}

interface JournalføringV2SkjemaProps {
  oppgave: Journalføringsoppgave
  journalpost: Journalpost
  mutateJournalpost(): void
}

function filtrertePåSøk(options: GjelderOption[], søk: string): GjelderOption[] {
  if (!søk) return options
  const ord = søk.toLowerCase().split(' ').filter(Boolean)
  return options.filter((o) => ord.every((ord) => o.searchTerms.includes(ord)))
}

export function JournalføringV2Skjema({
  oppgave,
  journalpost,
  mutateJournalpost,
}: JournalføringV2SkjemaProps & { mutateJournalpost: () => void }) {
  const [sakType, setSakType] = useState<'ny' | 'eksisterende'>('ny')
  const [valgtSakId, setValgtSakId] = useState<string | null>(null)
  const [valgtSakIdFeil, setValgtSakIdFeil] = useState<string | null>(null)
  const [dokumentTitler, setDokumentTitler] = useState<Record<string, string>>({})
  const [annetInnhold, setAnnetInnhold] = useState<Record<string, string[]>>({})
  const [journalføringResultat, setJournalføringResultat] = useState<JournalføringV2Response | null>(null)
  const [redigererBruker, setRedigererBruker] = useState(false)
  const [brukerInputFnr, setBrukerInputFnr] = useState('')
  const [brukerFeil, setBrukerFeil] = useState<string | null>(null)
  const [oppslagLaster, setOppslagLaster] = useState(false)
  const { behandlere } = useOppgavebehandlere()
  const mapper = useOppgaveMapper()
  const mottattDatoDefault = parseISO(journalpost.journalpostOpprettetTid)
  const aktivFraDatoDefault = new Date()
  const fristDefault = addWeeks(mottattDatoDefault, 4)
  const opprinneligJournalføresPåFnr = journalpost.bruker?.fnr ?? journalpost.fnrInnsender ?? ''

  const { journalførV2 } = useJournalføringActions(oppgave, journalpost.journalpostId)
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const kanRedigere = oppgaveErUnderBehandlingAvInnloggetAnsatt
  const { gjeldendeEnhet, navn } = useInnloggetAnsatt()

  const gjelderOptions = useGjelderOptions()

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
    mode: 'onChange',
    defaultValues: {
      tema: 'HJE',
      prioritet: Oppgaveprioritet.NORMAL,
      tilordnetEnhet: 'enhetensOppgaveliste',
      kommentar: ``,
      behandlingstype: journalpost.behandlingstema?.kode ?? '',
      stønadsklassifisering: 'DA',
      stønadType: 'S' as SakstypeKode,
      journalføresPåFnr: opprinneligJournalføresPåFnr,
      mottattDato: formatISO(mottattDatoDefault, { representation: 'date' }),
      aktivFra: formatISO(aktivFraDatoDefault, { representation: 'date' }),
      frist: formatISO(fristDefault, { representation: 'date' }),
    },
  })
  const journalføresPåFnr = watch('journalføresPåFnr')
  const { personInfo: valgtBruker } = usePerson(journalføresPåFnr || undefined)

  const valgtBehandlingstype = watch('behandlingstype')
  const valgtBehandlingstema = watch('behandlingstema')
  const valgtMottattDato = watch('mottattDato')
  const valgtAktivFra = watch('aktivFra')
  const valgtPrioritet = watch('prioritet')

  const [gjelderSøk, setGjelderSøk] = useState('')

  const filtrerteGjelderComboboxOptions = filtrertePåSøk(gjelderOptions, gjelderSøk).map(({ label, value }) => ({
    label,
    value,
  }))

  const valgtGjelderOptions = gjelderOptions.filter(
    (o) => o.value === `${valgtBehandlingstema}|${valgtBehandlingstype}`
  )

  // UNSAFE_Combobox forventer {label, value}[] — searchTerms strippes ut
  const gjelderComboboxOptions = useMemo(
    () => gjelderOptions.map(({ label, value }) => ({ label, value })),
    [gjelderOptions]
  )
  const valgtGjelderComboboxOptions = useMemo(
    () => valgtGjelderOptions.map(({ label, value }) => ({ label, value })),
    [valgtGjelderOptions]
  )

  useEffect(() => {
    register('journalføresPåFnr')
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

  function byggJournalføringPayload() {
    const tittel =
      dokumentTitler[journalpost.dokumenter[0]?.dokumentId ?? ''] ??
      journalpost.dokumenter[0]?.tittel ??
      journalpost.tittel
    const journalføresPåFnr = getValues('journalføresPåFnr')
    const dokumenter = journalpost.dokumenter.map((dok: Dokument) => ({
      dokumentId: dok.dokumentId,
      tittel: dokumentTitler[dok.dokumentId] ?? dok.tittel,
      annetInnhold: annetInnhold[dok.dokumentId] ?? [],
    }))
    return { tittel, journalføresPåFnr, dokumenter }
  }

  // TODO Sjekk tildelt enhet vs gjeldende enhet for saksbehandler. Kan det være forskjell på dem?
  const onSubmit = async (verdier: JournalføringV2SkjemaVerdier) => {
    const { tittel, journalføresPåFnr, dokumenter } = byggJournalføringPayload()
    const resultat = await journalførV2.trigger({
      tittel,
      journalføresPåFnr,
      saksgrunnlag: {
        tema: verdier.tema,
        prioritet: verdier.prioritet,
        oppgavetype: Oppgavetype.BEHANDLE_SAK,
        behandlingstype: verdier.behandlingstype,
        behandlingstema: verdier.behandlingstema,
        stønadsklassifisering: verdier.stønadsklassifisering,
        stønad: verdier.stønadType,
        kommentar: verdier.kommentar,
        mottattDato: verdier.mottattDato,
        aktivDato: verdier.aktivFra,
        fristDato: verdier.frist,
        tildeltEnhet: oppgave.tildeltEnhet.nummer,
        tildeltSaksbehandler: verdier.tilordnetEnhet === 'medarbeidersOppgaveliste' ? verdier.medarbeider : undefined,
      },
      dokumenter,
    })
    if (resultat) {
      mutateJournalpost()
      setJournalføringResultat(resultat)
    }
  }

  const onSubmitKobleTilSak = async () => {
    if (!valgtSakId) {
      setValgtSakIdFeil('Du må velge en sak å koble til')
      return
    }
    const { tittel, journalføresPåFnr, dokumenter } = byggJournalføringPayload()
    const resultat = await journalførV2.trigger({ tittel, journalføresPåFnr, sakId: valgtSakId, dokumenter })
    if (resultat) {
      mutateJournalpost()
      setJournalføringResultat(resultat)
    }
  }

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

  // TODO: Legge inn vertikal ikonlinje med dokumentoversikt, saksoversikt osv?

  const brukerNavn = valgtBruker
    ? formaterNavn(valgtBruker.navn)
    : journalpost.bruker
      ? formaterNavn(journalpost.bruker.navn)
      : ''
  const brukerFnr = valgtBruker?.fnr ?? journalføresPåFnr
  const registrertDato = formaterDato(journalpost.journalpostOpprettetTid)

  const tildeltEnhet = `${oppgave.tildeltEnhet.navn} - ${oppgave.tildeltEnhet.nummer}`

  return (
    <VStack gap="space-16">
      <HStack justify="space-between" align="center">
        <Heading level="1" size="xsmall">
          Journalføring
        </Heading>
        <JournalføringMenu oppgave={oppgave} onAction={mutateJournalpost} />
      </HStack>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <VStack gap="space-16">
          <div>
            <HStack gap="space-12" paddingBlock="space-0">
              <BodyShort size="small">
                <strong>Kilde:</strong>
                {`${journalpost.kanal.kode === 'SKAN_IM' ? ' Skanning' : ` ${journalpost.kanal.term}`}`}
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
                readOnly={!kanRedigere}
                rules={{ required: 'Du må velge tema' }}
              >
                <option value="HJE">Hjelpemidler</option>
              </SelectController>

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
                              <Button
                                variant="primary"
                                size="small"
                                type="button"
                                loading={oppslagLaster}
                                onClick={velgBruker}
                              >
                                Velg
                              </Button>
                              <Button
                                variant="secondary"
                                size="small"
                                type="button"
                                onClick={() => {
                                  setRedigererBruker(false)
                                  setBrukerFeil(null)
                                  setBrukerInputFnr('')
                                }}
                              >
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
                readOnly={!kanRedigere}
              />
            ))}
          </VStack>

          {kanRedigere && (
            <VStack gap="space-8" paddingBlock="space-40 space-0">
              <Heading level="2" size="xsmall">
                Ny eller eksisterende sak
              </Heading>
              <HStack gap="space-2">
                <ToggleGroup
                  defaultValue="ny"
                  size="small"
                  onChange={(value) => {
                    setSakType(value as 'ny' | 'eksisterende')
                    if (value === 'ny') {
                      setValgtSakId(null)
                      setValgtSakIdFeil(null)
                    }
                  }}
                  value={sakType}
                >
                  <ToggleGroup.Item value="ny">Opprett ny sak</ToggleGroup.Item>
                  <ToggleGroup.Item value="eksisterende">Koble til sak</ToggleGroup.Item>
                </ToggleGroup>
              </HStack>
            </VStack>
          )}

          {sakType === 'ny' && kanRedigere && (
            <VStack gap="space-20">
              <Heading level="2" size="small">
                Opprett ny sak i Hotsak
              </Heading>

              <div className={classes.metadataGrid}>
                <VStack gap="space-4">
                  <Label size="small">Oppgavetype</Label>
                  <BodyShort size="small">{OppgavetypeLabel[Oppgavetype.BEHANDLE_SAK]}</BodyShort>
                </VStack>

                <Controller
                  name="stønadType"
                  control={control}
                  rules={{
                    validate: (v) => v === 'S' || 'Hotsak kan kun behandle søknader. Du må overføre saken til Gosys',
                  }}
                  render={({ field, fieldState }) => (
                    <InlineRedigerbarSelect
                      label="Behandlingstype"
                      verdi={field.value}
                      tekst={stønadstype[field.value as SakstypeKode]}
                      kanRedigere={kanRedigere}
                      error={fieldState.error?.message}
                      className={classes.stønadTypeSelect}
                      onLagre={(kode) => field.onChange(kode)}
                    >
                      {(Object.entries(stønadstype) as [SakstypeKode, string][]).map(([kode, tekst]) => (
                        <option key={kode} value={kode}>
                          {tekst}
                        </option>
                      ))}
                    </InlineRedigerbarSelect>
                  )}
                />

                <Controller
                  name="stønadsklassifisering"
                  control={control}
                  rules={{
                    validate: (v) => v === 'DA' || 'Hotsak kan kun behandle dagligliv. Du må overføre saken til Gosys',
                  }}
                  render={({ field, fieldState }) => (
                    <InlineRedigerbarSelect
                      label="Stønadsklassifisering"
                      verdi={field.value}
                      tekst={stønadsklassifiseringData.stk2.find((s) => s.kode === field.value)?.tekst ?? ''}
                      kanRedigere={kanRedigere}
                      error={fieldState.error?.message}
                      className={classes.stønadsklassifiseringSelect}
                      onLagre={(kode) => field.onChange(kode)}
                    >
                      {stønadsklassifiseringData.stk2.map((s) => (
                        <option key={s.kode} value={s.kode}>
                          {s.tekst}
                        </option>
                      ))}
                    </InlineRedigerbarSelect>
                  )}
                />

                <InlineRedigerbarDato
                  label="Mottatt dato"
                  verdi={parseISO(valgtMottattDato)}
                  kanRedigere={kanRedigere}
                  onLagre={(dato) => {
                    const datoStr = formatISO(dato, { representation: 'date' })
                    setValue('mottattDato', datoStr)
                    setValue('aktivFra', datoStr, { shouldValidate: true })
                    const nyFrist = addWeeks(dato, 4)
                    setFrist(nyFrist)
                    setValue('frist', formatISO(nyFrist, { representation: 'date' }), { shouldValidate: true })
                  }}
                />

                <VStack gap="space-4">
                  <InlineRedigerbarDato
                    label="Aktiv fra"
                    verdi={parseISO(valgtAktivFra)}
                    kanRedigere={kanRedigere}
                    onLagre={(dato) => {
                      setValue('aktivFra', formatISO(dato, { representation: 'date' }), { shouldValidate: true })
                    }}
                  />
                  {errors.aktivFra?.message && <ErrorMessage size="small">{errors.aktivFra.message}</ErrorMessage>}
                </VStack>

                <InlineRedigerbarSelect
                  label="Prioritet"
                  verdi={valgtPrioritet}
                  tekst={OppgaveprioritetLabel[valgtPrioritet]}
                  kanRedigere={kanRedigere}
                  onLagre={(prioritet) => setValue('prioritet', prioritet as Oppgaveprioritet)}
                >
                  {Object.values(Oppgaveprioritet).map((p) => (
                    <option key={p} value={p}>
                      {OppgaveprioritetLabel[p]}
                    </option>
                  ))}
                </InlineRedigerbarSelect>
              </div>

              <TextContainer>
                <HStack gap="space-20" align="start" wrap={false}>
                  <VStack gap="space-12" align="start">
                    <UNSAFE_Combobox
                      label="Gjelder"
                      size="small"
                      shouldAutocomplete
                      allowNewValues={false}
                      readOnly={!kanRedigere}
                      className={classes.kodeverkSelect}
                      options={gjelderComboboxOptions}
                      filteredOptions={filtrerteGjelderComboboxOptions}
                      selectedOptions={valgtGjelderComboboxOptions}
                      value={gjelderSøk}
                      onChange={(value) => setGjelderSøk(value)}
                      onToggleSelected={(value, isSelected) => {
                        if (isSelected) {
                          const [tmKode, btKode] = value.split('|')
                          setValue('behandlingstema', tmKode ?? '')
                          setValue('behandlingstype', btKode ?? '')
                        } else {
                          setValue('behandlingstema', '')
                          setValue('behandlingstype', '')
                        }
                        setGjelderSøk('')
                      }}
                    />
                  </VStack>
                  <DatePicker {...fristProps}>
                    <DatePicker.Input {...fristInputProps} label="Frist" size="small" readOnly={!kanRedigere} />
                  </DatePicker>
                </HStack>
              </TextContainer>

              <TextContainer>
                <Controller
                  name="kommentar"
                  control={control}
                  render={({ field }) => (
                    <Textarea
                      label="Kommentar til saksbehandler (valgfritt)"
                      description="Her kan du informere om eventuelle mangler eller annet som bør sjekkes opp i saken"
                      size="small"
                      maxLength={1000}
                      readOnly={!kanRedigere}
                      {...field}
                      error={errors.kommentar?.message}
                    />
                  )}
                />
              </TextContainer>

              {/* Tilordne oppgave */}
              <VStack gap="space-4" paddingBlock="space-20 space-0" hidden={!kanRedigere}>
                <Label size="small">Tilordne oppgave</Label>
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
                      <Radio value="minOppgaveliste">
                        Min oppgaveliste: {gjeldendeEnhet.nummer} | {navn}
                      </Radio>
                      <Radio value="medarbeidersOppgaveliste">Medarbeider sin oppgaveliste</Radio>
                      {field.value === 'medarbeidersOppgaveliste' && (
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

                      <Radio value="enhetensOppgaveliste">Min enhet: {tildeltEnhet}</Radio>
                      {field.value === 'enhetensOppgaveliste' && (
                        <Box paddingInline="space-32 space-0">
                          <Select label="Enhetsmappe" size="small" {...register('enhetsmappe')}>
                            <option value="">Enhetens liste</option>
                            {mapper.map((mappe) => (
                              <option key={mappe.id} value={mappe.id.toString()}>
                                {mappe.navn}
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
          {sakType === 'eksisterende' && kanRedigere && brukerFnr && (
            <VStack gap="space-8" paddingBlock="space-20 space-0">
              <Heading level="2" size="small">
                Koble til eksisterende sak
              </Heading>
              <KobleTilSakKort
                fnr={brukerFnr}
                valgtSakId={valgtSakId}
                onChange={(sakId) => {
                  setValgtSakId(sakId)
                  if (sakId) setValgtSakIdFeil(null)
                }}
                feilmelding={valgtSakIdFeil ?? undefined}
              />
            </VStack>
          )}

          {kanRedigere && (
            <HStack gap="space-4" paddingBlock="space-8 space-0">
              <Button
                type={sakType === 'eksisterende' ? 'button' : 'submit'}
                variant="primary"
                size="small"
                loading={journalførV2.isMutating}
                disabled={journalførV2.isMutating}
                onClick={sakType === 'eksisterende' ? onSubmitKobleTilSak : undefined}
              >
                {sakType === 'eksisterende' ? 'Journalfør' : 'Journalfør og opprett sak'}
              </Button>

              <Button type="button" variant="secondary" size="small">
                Overfør til Gosys
              </Button>
            </HStack>
          )}
        </VStack>
      </form>

      <JournalføringFerdigModal
        open={journalføringResultat != null}
        resultat={journalføringResultat}
        sakType={sakType}
        onClose={() => setJournalføringResultat(null)}
      />
    </VStack>
  )
}

function InlineRedigerbarSelect({
  label,
  verdi,
  tekst,
  kanRedigere,
  onLagre,
  error,
  className,
  children,
}: {
  label: string
  verdi: string
  tekst: string
  kanRedigere: boolean
  onLagre: (ny: string) => void
  error?: string
  className?: string
  children: ReactNode
}) {
  const [redigerer, setRedigerer] = useState(false)

  if (redigerer) {
    return (
      <VStack gap="space-4">
        <Label size="small">{label}</Label>
        <div className={className}>
          <Select
            label=""
            hideLabel
            size="small"
            defaultValue={verdi}
            autoFocus
            error={error ? <span className={classes.errorWrap}>{error}</span> : undefined}
            onChange={(e) => {
              onLagre(e.target.value)
            }}
          >
            {children}
          </Select>
        </div>
      </VStack>
    )
  }

  return (
    <VStack gap="space-4">
      <Label size="small">{label}</Label>
      <HStack align="center">
        <BodyShort size="small">{tekst}</BodyShort>
        {kanRedigere && (
          <Button variant="tertiary" size="xsmall" type="button" onClick={() => setRedigerer(true)}>
            Endre
          </Button>
        )}
      </HStack>
    </VStack>
  )
}

function InlineRedigerbarDato({
  label,
  verdi,
  kanRedigere,
  onLagre,
}: {
  label: string
  verdi: Date
  kanRedigere: boolean
  onLagre: (dato: Date) => void
}) {
  const [redigerer, setRedigerer] = useState(false)

  const { datepickerProps, inputProps } = useDatepicker({
    defaultSelected: verdi,
    onDateChange: (dato) => {
      if (dato) {
        onLagre(dato)
      }
    },
  })

  if (redigerer) {
    return (
      <VStack gap="space-4">
        <Label size="small">{label}</Label>
        <DatePicker {...datepickerProps}>
          <DatePicker.Input {...inputProps} label="" hideLabel size="small" autoFocus />
        </DatePicker>
      </VStack>
    )
  }

  return (
    <VStack gap="space-4">
      <Label size="small">{label}</Label>
      <HStack align="center">
        <BodyShort size="small">{formaterDato(formatISO(verdi, { representation: 'date' }))}</BodyShort>
        {kanRedigere && (
          <Button variant="tertiary" size="xsmall" type="button" onClick={() => setRedigerer(true)}>
            Endre
          </Button>
        )}
      </HStack>
    </VStack>
  )
}

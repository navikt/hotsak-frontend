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
  Textarea,
  ToggleGroup,
  UNSAFE_Combobox,
  useDatepicker,
  VStack,
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
import { type Dokument, type Journalpost } from '../types/types.internal.ts'
import { formaterDato } from '../utils/dato.ts'
import { formaterNavn } from '../utils/formater.ts'
import { DokumentRad } from './DokumentRad.tsx'
import { JournalføringFerdigModal } from './JournalføringFerdigModal.tsx'
import { JournalføringMenu } from './JournalføringMenu.tsx'
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
  const [sakType, setSakType] = useState<string>('ny')
  const [dokumentTitler, setDokumentTitler] = useState<Record<string, string>>({})
  const [annetInnhold, setAnnetInnhold] = useState<Record<string, string[]>>({})
  const [journalføringResultat, setJournalføringResultat] = useState<JournalføringV2Response | null>(null)
  const { behandlere } = useOppgavebehandlere()
  const mapper = useOppgaveMapper()
  const mottattDatoDefault = parseISO(journalpost.journalpostOpprettetTid)
  const aktivFraDatoDefault = new Date()
  const fristDefault = addWeeks(mottattDatoDefault, 4)

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
      mottattDato: formatISO(mottattDatoDefault, { representation: 'date' }),
      aktivFra: formatISO(aktivFraDatoDefault, { representation: 'date' }),
      frist: formatISO(fristDefault, { representation: 'date' }),
    },
  })

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

  // TODO Sjekk tildelt enhet vs gjeldende enhet for saksbehandler. Kan det være forskjell på dem?
  const onSubmit = async (verdier: JournalføringV2SkjemaVerdier) => {
    const tittel =
      dokumentTitler[journalpost.dokumenter[0]?.dokumentId ?? ''] ??
      journalpost.dokumenter[0]?.tittel ??
      journalpost.tittel
    const resultat = await journalførV2.trigger({
      tittel,
      journalføresPåFnr: journalpost.bruker?.fnr ?? journalpost.fnrInnsender ?? '',
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
      dokumenter: journalpost.dokumenter.map((dok: Dokument) => ({
        dokumentId: dok.dokumentId,
        tittel: dokumentTitler[dok.dokumentId] ?? dok.tittel,
        annetInnhold: annetInnhold[dok.dokumentId] ?? [],
      })),
    })
    if (resultat) {
      setJournalføringResultat(resultat)
    }
  }

  // TODO: Legge inn vertikal ikonlinje med dokumentoversikt, saksoversikt osv?

  const brukerNavn = journalpost.bruker ? formaterNavn(journalpost.bruker.navn) : ''
  const brukerFnr = journalpost.bruker?.fnr ?? journalpost.fnrInnsender
  const avsenderNavn = journalpost.innsender ? formaterNavn(journalpost.innsender.navn) : ''
  const avsenderFnr = journalpost.innsender?.fnr ?? ''
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
                  <VStack gap="space-4">
                    <Label size="small">Bruker</Label>
                    <HStack gap="space-1" align="center">
                      <BodyShort size="small">{brukerNavn} - </BodyShort>
                      <BodyShort size="small">{brukerFnr}</BodyShort>
                      <InlineKopiknapp copyText={brukerFnr} tooltip="Kopier fødselsnummer" />
                    </HStack>
                    <BodyShort size="small">{tildeltEnhet}</BodyShort>
                  </VStack>
                  {kanRedigere && (
                    <Button variant="tertiary" size="xsmall" type="button" hidden={!kanRedigere}>
                      Endre
                    </Button>
                  )}
                </HStack>
              </Box>

              <Box borderRadius="12" borderWidth="1" borderColor="neutral-subtle" padding="space-12">
                <HStack justify="space-between" align="start">
                  <VStack gap="space-4">
                    <Label size="small">Avsender</Label>
                    <HStack gap="space-1" align="center">
                      <BodyShort size="small">{avsenderNavn} - </BodyShort>
                      <BodyShort size="small">{avsenderFnr}</BodyShort>
                      <InlineKopiknapp copyText={avsenderFnr} tooltip="Kopier fødselsnummer" />
                    </HStack>
                    <BodyShort size="small">{tildeltEnhet}</BodyShort>
                  </VStack>
                  {kanRedigere && (
                    <Button variant="tertiary" size="xsmall" type="button" hidden={!kanRedigere}>
                      Endre
                    </Button>
                  )}
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
                <ToggleGroup defaultValue="ny" size="small" onChange={(value) => setSakType(value)} value={sakType}>
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

                <VStack gap="space-4">
                  <Label size="small">Behandlingstype</Label>
                  <Controller
                    name="stønadType"
                    control={control}
                    rules={{
                      validate: (v) => v === 'S' || 'Hotsak kan kun behandle søknader. Du må overføre saken til Gosys',
                    }}
                    render={({ field, fieldState }) => (
                      <InlineRedigerbarSelect
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
                </VStack>
                <VStack gap="space-4">
                  <Label size="small">Stønadsklassifisering</Label>
                  <Controller
                    name="stønadsklassifisering"
                    control={control}
                    rules={{
                      validate: (v) =>
                        v === 'DA' || 'Hotsak kan kun behandle dagligliv. Du må overføre saken til Gosys',
                    }}
                    render={({ field, fieldState }) => (
                      <InlineRedigerbarSelect
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
                </VStack>

                <VStack gap="space-4">
                  <Label size="small">Mottatt dato</Label>
                  <InlineRedigerbarDato
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
                </VStack>
                <VStack gap="space-4">
                  <Label size="small">Aktiv fra</Label>
                  <InlineRedigerbarDato
                    verdi={parseISO(valgtAktivFra)}
                    kanRedigere={kanRedigere}
                    onLagre={(dato) => {
                      setValue('aktivFra', formatISO(dato, { representation: 'date' }), { shouldValidate: true })
                    }}
                  />
                  {errors.aktivFra?.message && <ErrorMessage size="small">{errors.aktivFra.message}</ErrorMessage>}
                </VStack>

                <VStack gap="space-4">
                  <Label size="small">Prioritet</Label>
                  <InlineRedigerbarSelect
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
                </VStack>
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
          {sakType === 'eksisterende' && kanRedigere && <div>TODO</div>}

          {kanRedigere && (
            <HStack gap="space-4" paddingBlock="space-8 space-0">
              <Button
                type="submit"
                variant="primary"
                size="small"
                loading={journalførV2.isMutating}
                disabled={journalførV2.isMutating}
              >
                Journalfør og opprett sak
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
        onClose={() => setJournalføringResultat(null)}
      />
    </VStack>
  )
}

function InlineRedigerbarSelect({
  verdi,
  tekst,
  kanRedigere,
  onLagre,
  error,
  className,
  children,
}: {
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
      <div className={className}>
        <Select
          label=""
          hideLabel
          size="small"
          defaultValue={verdi}
          autoFocus
          error={error ? <span style={{ display: 'block', overflowWrap: 'break-word' }}>{error}</span> : undefined}
          onChange={(e) => onLagre(e.target.value)}
        >
          {children}
        </Select>
      </div>
    )
  }

  return (
    <HStack align="center">
      <BodyShort size="small">{tekst}</BodyShort>
      {kanRedigere && (
        <Button variant="tertiary" size="xsmall" type="button" onClick={() => setRedigerer(true)}>
          Endre
        </Button>
      )}
    </HStack>
  )
}

function InlineRedigerbarDato({
  verdi,
  kanRedigere,
  onLagre,
}: {
  verdi: Date
  kanRedigere: boolean
  onLagre: (dato: Date) => void
}) {
  const [redigerer, setRedigerer] = useState(false)

  const { datepickerProps, inputProps } = useDatepicker({
    defaultSelected: verdi,
    onDateChange: (dato) => {
      if (dato) onLagre(dato)
    },
  })

  if (redigerer) {
    return (
      <DatePicker {...datepickerProps}>
        <DatePicker.Input {...inputProps} label="" hideLabel size="small" autoFocus />
      </DatePicker>
    )
  }

  return (
    <HStack align="center">
      <BodyShort size="small">{formaterDato(formatISO(verdi, { representation: 'date' }))}</BodyShort>
      {kanRedigere && (
        <Button variant="tertiary" size="xsmall" type="button" onClick={() => setRedigerer(true)}>
          Endre
        </Button>
      )}
    </HStack>
  )
}

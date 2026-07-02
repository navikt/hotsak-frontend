import {
  BodyShort,
  Box,
  Button,
  DatePicker,
  Detail,
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
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'

import { InlineKopiknapp } from '../felleskomponenter/Kopiknapp.tsx'
import { Skillelinje } from '../felleskomponenter/Strek.tsx'
import { ComboboxController } from '../felleskomponenter/skjema/ComboboxController.tsx'
import { SelectController } from '../felleskomponenter/skjema/SelectController.tsx'
import { TextContainer } from '../felleskomponenter/typografi.tsx'
import { type Journalføringsoppgave, Oppgaveprioritet, Oppgavetype } from '../oppgave/oppgaveTypes.ts'
import {
  harBehandlingstema,
  useKodeverkBehandlingstyper,
  useKodeverkGjelder,
  useKodeverkStønadsklassifisering,
} from '../oppgave/useKodeverkOppgave.ts'
import { useOppgaveMapper } from '../oppgave/useOppgave.ts'
import { useOppgavebehandlere } from '../oppgave/useOppgavebehandlere.ts'
import { useOppgaveregler } from '../oppgave/useOppgaveregler.ts'
import { type Dokument, type Journalpost } from '../types/types.internal.ts'
import { formaterDato } from '../utils/dato.ts'
import { formaterNavn } from '../utils/formater.ts'
import { DokumentRad } from './DokumentRad.tsx'
import { JournalføringFerdigModal } from './JournalføringFerdigModal.tsx'
import classes from './JournalføringV2Skjema.module.css'
import { type JournalføringV2Response } from './journalføringTypes.ts'
import { useJournalføringActions } from './useJournalføringActions.ts'
import { JournalføringMenu } from './JournalføringMenu.tsx'

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

// TODO: Flytte sakstyper til kodeverk
const SAKTYPE_LABELS: Record<string, string> = {
  A: 'Anke',
  K: 'Klage',
  KT: 'Klage tilbakebetaling',
  R: 'Revurdering',
  S: 'Søknad',
  T: 'Tilbakebetaling',
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
  const fristDefault = addWeeks(mottattDatoDefault, 4)

  const behandlingstyper = useKodeverkBehandlingstyper()

  const { journalførV2 } = useJournalføringActions(oppgave, journalpost.journalpostId)
  const { oppgaveErUnderBehandlingAvInnloggetAnsatt } = useOppgaveregler(oppgave)
  const kanRedigere = oppgaveErUnderBehandlingAvInnloggetAnsatt

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
      prioritet: Oppgaveprioritet.NORMAL,
      tilordnetEnhet: 'enhetensOppgaveliste',
      kommentar: ``,
      behandlingstype: journalpost.behandlingstema?.kode ?? '',
      mottattDato: formatISO(mottattDatoDefault, { representation: 'date' }),
      aktivFra: formatISO(mottattDatoDefault, { representation: 'date' }),
      frist: formatISO(fristDefault, { representation: 'date' }),
    },
  })

  const valgtBehandlingstype = watch('behandlingstype')
  const valgtBehandlingstema = watch('behandlingstema')
  const valgtStønadsklassifisering = watch('stønadsklassifisering')

  const gjelderOptions = useKodeverkGjelder(valgtBehandlingstype || undefined)
    .filter(harBehandlingstema)
    .sort((a, b) => a.behandlingstema.term.localeCompare(b.behandlingstema.term))

  const alleGjelder = useKodeverkGjelder()
  const stønadsklassifiseringData = useKodeverkStønadsklassifisering()

  const valgtStk2 = stønadsklassifiseringData?.stk2.find((s) => s.kode === valgtStønadsklassifisering)

  // Auto-set stønadsklassifisering basert på valgt behandlingstype
  useEffect(() => {
    if (!valgtBehandlingstype || !stønadsklassifiseringData) return
    const match = stønadsklassifiseringData.stk2.find((stk2) => stk2.behandlingstype?.includes(valgtBehandlingstype))
    if (match) setValue('stønadsklassifisering', match.kode)
  }, [valgtBehandlingstype, stønadsklassifiseringData, setValue])

  // Auto-set stønadsklassifisering basert på valgt behandlingstema
  useEffect(() => {
    if (!valgtBehandlingstema || !stønadsklassifiseringData) return
    const match = stønadsklassifiseringData.stk2.find((stk2) => stk2.behandlingstema?.includes(valgtBehandlingstema))
    if (match) setValue('stønadsklassifisering', match.kode)
  }, [valgtBehandlingstema, stønadsklassifiseringData, setValue])

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
        <HStack justify="space-between" align="center">
          <Heading level="1" size="xsmall">
            Journalføring
          </Heading>
          <JournalføringMenu oppgave={oppgave} onAction={mutateJournalpost} />
        </HStack>
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
                <VStack gap="space-1">
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
                <VStack gap="space-1">
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
            <VStack gap="space-12" align="start">
              <ComboboxController
                control={control}
                name="behandlingstype"
                label="Behandlingstype"
                size="small"
                readOnly={!kanRedigere}
                rules={{ required: 'Du må velge behandlingstype' }}
                className={classes.kodeverkSelect}
                options={behandlingstyper.map((bt) => ({ label: bt.term, value: bt.kode }))}
              />
              <ComboboxController
                control={control}
                name="behandlingstema"
                label="Behandlingstema"
                size="small"
                readOnly={!kanRedigere}
                rules={{ required: 'Du må velge behandlingstema' }}
                className={classes.kodeverkSelect}
                disabled={!valgtBehandlingstype}
                options={gjelderOptions.map((g) => ({ label: g.behandlingstema.term, value: g.behandlingstema.kode }))}
              />
              {/* Demo: kombinert Gjelder-combobox */}

              <Box padding="space-12" background="warning-soft">
                <VStack gap="space-1">
                  <HStack gap="space-2" align="center" paddingBlock="space-4">
                    <Label size="small" spacing>
                      Gjelder
                    </Label>
                    <Detail spacing>
                      Kun for testing. Kombinasjon av behandlingstema og behandlingstype som i Gosys{' '}
                    </Detail>
                  </HStack>
                  <UNSAFE_Combobox
                    label="Gjelder"
                    hideLabel
                    size="small"
                    shouldAutocomplete
                    allowNewValues={false}
                    readOnly={!kanRedigere}
                    className={classes.kodeverkSelect}
                    options={alleGjelder
                      .filter((g) => g.behandlingstema != null || g.behandlingstype != null)
                      .sort((a, b) => {
                        const tmCmp = (a.behandlingstema?.term ?? '').localeCompare(b.behandlingstema?.term ?? '', 'nb')
                        if (tmCmp !== 0) return tmCmp
                        return (a.behandlingstype?.term ?? '').localeCompare(b.behandlingstype?.term ?? '', 'nb')
                      })
                      .map((g) => {
                        const label =
                          g.behandlingstema == null
                            ? (g.behandlingstype?.term ?? '')
                            : g.behandlingstype == null
                              ? g.behandlingstema.term
                              : `${g.behandlingstema.term} | ${g.behandlingstype.term}`
                        return {
                          label,
                          value: `${g.behandlingstema?.kode ?? ''}|${g.behandlingstype?.kode ?? ''}`,
                        }
                      })}
                    selectedOptions={alleGjelder
                      .filter(
                        (g) =>
                          g.behandlingstema?.kode === (valgtBehandlingstema || undefined) &&
                          g.behandlingstype?.kode === (valgtBehandlingstype || undefined)
                      )
                      .map((g) => ({
                        label:
                          g.behandlingstema == null
                            ? (g.behandlingstype?.term ?? '')
                            : g.behandlingstype == null
                              ? g.behandlingstema.term
                              : `${g.behandlingstema.term} | ${g.behandlingstype.term}`,
                        value: `${g.behandlingstema?.kode ?? ''}|${g.behandlingstype?.kode ?? ''}`,
                      }))}
                    onToggleSelected={(value, isSelected) => {
                      if (isSelected) {
                        const [tmKode, btKode] = value.split('|')
                        setValue('behandlingstema', tmKode ?? '')
                        setValue('behandlingstype', btKode ?? '')
                      } else {
                        setValue('behandlingstema', '')
                        setValue('behandlingstype', '')
                      }
                    }}
                  />
                </VStack>
              </Box>
              <SelectController
                control={control}
                name="prioritet"
                label="Prioritet"
                size="small"
                readOnly={!kanRedigere}
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
            <HStack gap="space-4" align="start">
              <ComboboxController
                control={control}
                name="stønadsklassifisering"
                label="Stønadsklassifisering"
                size="small"
                readOnly={!kanRedigere}
                rules={{ required: 'Du må velge stønadsklassifisering' }}
                className={classes.kodeverkSelect}
                options={stønadsklassifiseringData?.stk2.map((s) => ({ label: s.tekst, value: s.kode })) ?? []}
              />
              <SelectController
                control={control}
                name="stønadsUnderkategori"
                label="Område"
                size="small"
                readOnly={!kanRedigere}
              >
                <option value="">Velg</option>
                {valgtStk2?.stk3 && <option value={valgtStk2.stk3.kode}>{valgtStk2.stk3.tekst}</option>}
              </SelectController>
              <SelectController
                control={control}
                name="stønadType"
                label="Stønad"
                size="small"
                readOnly={!kanRedigere}
                rules={{ required: 'Du må velge stønad' }}
                disabled={!valgtStk2}
              >
                <option value="">Velg</option>
                {valgtStk2?.sakstyper.map((kode) => (
                  <option key={kode} value={kode}>
                    {SAKTYPE_LABELS[kode] ?? kode}
                  </option>
                ))}
              </SelectController>
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
                    readOnly={!kanRedigere}
                    {...field}
                    error={errors.kommentar?.message}
                  />
                )}
              />
            </TextContainer>

            <HStack gap="space-4" align="start">
              <DatePicker {...mottattProps}>
                <DatePicker.Input {...mottattInputProps} label="Mottatt dato" size="small" readOnly={!kanRedigere} />
              </DatePicker>
              <DatePicker {...aktivFraProps}>
                <DatePicker.Input
                  {...aktivFraInputProps}
                  label="Aktiv fra"
                  size="small"
                  readOnly={!kanRedigere}
                  error={errors.aktivFra?.message}
                />
              </DatePicker>
              <DatePicker {...fristProps}>
                <DatePicker.Input {...fristInputProps} label="Frist" size="small" readOnly={!kanRedigere} />
              </DatePicker>
            </HStack>

            {/* Tilordne oppgave */}
            <VStack gap="space-4" paddingBlock="space-20 space-0" hidden={!kanRedigere}>
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
                          <option value="">Ingen mappe</option>
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
            <Button type="submit" variant="primary" size="small">
              Journalfør og opprett sak
            </Button>

            <Button type="button" variant="secondary" size="small">
              Overfør til Gosys
            </Button>
          </HStack>
        )}
      </VStack>

      <JournalføringFerdigModal
        open={journalføringResultat != null}
        resultat={journalføringResultat}
        onClose={() => setJournalføringResultat(null)}
      />
    </form>
  )
}

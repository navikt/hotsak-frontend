import { DatePicker, Heading, Textarea, VStack, HStack, Label, BodyShort, ErrorMessage } from '@navikt/ds-react'
import { Controller, useFormContext } from 'react-hook-form'
import { useMemo, useState } from 'react'

import { type GjelderOption, useGjelderOptions } from '../oppgave/useKodeverkOppgave.ts'
import { TextContainer } from '../felleskomponenter/typografi.tsx'
import { type JournalføringV2SkjemaVerdier, type SakstypeKode } from './journalføringTypes.ts'
import { TilordneOppgave } from './TilordneOppgave.tsx'
import classes from './JournalføringV2Skjema.module.css'
import { UNSAFE_Combobox } from '@navikt/ds-react'
import { OppgaveprioritetLabel, Oppgavetype, OppgavetypeLabel, Oppgaveprioritet } from '../oppgave/oppgaveTypes.ts'
import { InlineRedigerbarDato, InlineRedigerbarSelect } from './InlineRedigerbareFelt.tsx'
import { addWeeks, formatISO, parseISO } from 'date-fns'
import { stønadsklassifiseringData, stønadstype } from '../oppgave/stønadsklassifiseringData.ts'

function filtrertePåSøk(options: GjelderOption[], søk: string): GjelderOption[] {
  if (!søk) return options
  const ord = søk.toLowerCase().split(' ').filter(Boolean)
  return options.filter((o) => ord.every((ord) => o.searchTerms.includes(ord)))
}

interface NySakSkjemaProps {
  kanRedigere: boolean
  tildeltEnhet: string
  setFrist: (dato: Date) => void
  fristProps: object
  fristInputProps: object
}

export function NySakSkjema({ kanRedigere, tildeltEnhet, setFrist, fristProps, fristInputProps }: NySakSkjemaProps) {
  const {
    watch,
    setValue,
    formState: { errors },
  } = useFormContext<JournalføringV2SkjemaVerdier>()

  const valgtMottattDato = watch('mottattDato')
  const valgtAktivFra = watch('aktivFra')
  const valgtPrioritet = watch('prioritet')
  const valgtBehandlingstype = watch('behandlingstype')
  const valgtBehandlingstema = watch('behandlingstema')

  const [gjelderSøk, setGjelderSøk] = useState('')
  const gjelderOptions = useGjelderOptions()

  const filtrerteGjelderComboboxOptions = filtrertePåSøk(gjelderOptions, gjelderSøk).map(({ label, value }) => ({
    label,
    value,
  }))

  const gjelderComboboxOptions = useMemo(
    () => gjelderOptions.map(({ label, value }) => ({ label, value })),
    [gjelderOptions]
  )

  const valgtGjelderOptions = gjelderOptions.filter(
    (o) => o.value === `${valgtBehandlingstema}|${valgtBehandlingstype}`
  )

  const valgtGjelderComboboxOptions = useMemo(
    () => valgtGjelderOptions.map(({ label, value }) => ({ label, value })),
    [valgtGjelderOptions]
  )

  return (
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
          <DatePicker {...(fristProps as Parameters<typeof DatePicker>[0])}>
            <DatePicker.Input
              {...(fristInputProps as Parameters<typeof DatePicker.Input>[0])}
              label="Frist"
              size="small"
              readOnly={!kanRedigere}
            />
          </DatePicker>
        </HStack>
      </TextContainer>

      <TextContainer>
        <Controller
          name="kommentar"
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

      <TilordneOppgave tildeltEnhet={tildeltEnhet} />
    </VStack>
  )
}

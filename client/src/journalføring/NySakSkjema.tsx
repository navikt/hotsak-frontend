import {
  BodyShort,
  DatePicker,
  ErrorMessage,
  Heading,
  HStack,
  Label,
  Textarea,
  useDatepicker,
  VStack,
} from '@navikt/ds-react'
import { addWeeks, formatISO, isAfter, parseISO } from 'date-fns'
import { useEffect } from 'react'
import { Controller, useFormContext } from 'react-hook-form'

import { GjelderCombobox } from '../felleskomponenter/skjema/GjelderCombobox.tsx'
import { TextContainer } from '../felleskomponenter/typografi.tsx'
import { JournalføringSvartidsbrev } from './JournalføringSvartidsbrev.tsx'
import { type JournalføringSkjemaVerdier, type SakstypeKode, type SvartidsbrevValg } from './journalføringTypes.ts'
import { TilordneOppgave } from './TilordneOppgave.tsx'
import classes from './JournalføringSkjema.module.css'
import {
  type Journalføringsoppgave,
  Oppgaveprioritet,
  OppgaveprioritetLabel,
  Oppgavetype,
  OppgavetypeLabel,
} from '../oppgave/oppgaveTypes.ts'
import { InlineRedigerbarDato, InlineRedigerbarSelect } from './InlineRedigerbareFelt.tsx'
import { stønadsklassifiseringData, stønadstype } from '../oppgave/stønadsklassifiseringData.ts'

interface NySakSkjemaProps {
  kanRedigere: boolean
  tildeltEnhet: string
  oppgave: Journalføringsoppgave
  onSvartidsbrevChange: (valg: SvartidsbrevValg | null) => void
  visSvartidsbrevFeil?: boolean
}

export function NySakSkjema({
  kanRedigere,
  tildeltEnhet,
  oppgave,
  onSvartidsbrevChange,
  visSvartidsbrevFeil,
}: NySakSkjemaProps) {
  const {
    watch,
    setValue,
    getValues,
    register,
    trigger,
    formState: { errors },
  } = useFormContext<JournalføringSkjemaVerdier>()

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
    defaultSelected: parseISO(getValues('frist')),
    onDateChange: (dato) => {
      if (dato) {
        setValue('frist', formatISO(dato, { representation: 'date' }))
        trigger('aktivFra')
      }
    },
  })

  const valgtMottattDato = watch('mottattDato')
  const valgtAktivFra = watch('aktivFra')
  const valgtPrioritet = watch('prioritet')
  const valgtBehandlingstype = watch('behandlingstype')
  const valgtBehandlingstema = watch('behandlingstema')

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
            <Controller
              name="behandlingstema"
              rules={{
                validate: (_, verdier) =>
                  Boolean(verdier.behandlingstema || verdier.behandlingstype) || 'Du må velge hva saken gjelder',
              }}
              render={({ field, fieldState }) => (
                <GjelderCombobox
                  ref={field.ref}
                  name={field.name}
                  readOnly={!kanRedigere}
                  className={classes.kodeverkSelect}
                  error={fieldState.error?.message}
                  onBlur={field.onBlur}
                  value={{ behandlingstema: valgtBehandlingstema, behandlingstype: valgtBehandlingstype }}
                  onChange={({ behandlingstema, behandlingstype }) => {
                    setValue('behandlingstype', behandlingstype)
                    field.onChange(behandlingstema)
                  }}
                />
              )}
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

      <JournalføringSvartidsbrev
        oppgave={oppgave}
        mottattDato={valgtMottattDato}
        visÅrsakFeil={visSvartidsbrevFeil}
        onChange={onSvartidsbrevChange}
      />

      <TilordneOppgave tildeltEnhet={tildeltEnhet} />
    </VStack>
  )
}

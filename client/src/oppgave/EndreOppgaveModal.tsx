import { PersonMinusIcon } from '@navikt/aksel-icons'
import {
  Box,
  Button,
  DatePicker,
  ErrorMessage,
  HStack,
  Select,
  Textarea,
  UNSAFE_Combobox,
  useDatepicker,
  VStack,
} from '@navikt/ds-react'
import { isBefore } from 'date-fns'
import { useMemo } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'

import { FormModal } from '../felleskomponenter/modal/FormModal.tsx'
import { ComboboxController } from '../felleskomponenter/skjema/ComboboxController.tsx'
import { GjelderCombobox } from '../felleskomponenter/skjema/GjelderCombobox.tsx'
import { useToast } from '../felleskomponenter/toast/useToast.ts'
import { useMutateOppgaver } from '../oppgaveliste/useMutateOppgaver.ts'
import { tilDato, tilLocalDateString } from '../utils/dato.ts'
import { isNotBlank } from '../utils/type.ts'
import { mutateOppgavekommentarer } from './kommentar/useOppgavekommentarer.ts'
import { type Oppgave, Oppgaveprioritet, OppgaveprioritetLabel } from './oppgaveTypes.ts'
import { mutateOppgave, useOppgaveMapper, useOppgaveNøkkelord } from './useOppgave.ts'
import { type PatchOppgaveRequest, useOppgaveActions } from './useOppgaveActions.ts'
import { useOppgavebehandlere } from './useOppgavebehandlere.ts'

const MAKS_LENGDE_NØKKELORD = 40

export interface EndreOppgaveModalProps {
  oppgave: Oppgave
  onClose(): void
}

interface EndreOppgaveSkjemaverdier {
  behandlingstema: string
  behandlingstype: string
  prioritet: Oppgaveprioritet
  nøkkelord: string[]
  mappeId: string
  tildeltSaksbehandler: string
  aktivDato?: Date
  fristDato?: Date
  kommentar: string
}

export function EndreOppgaveModal(props: EndreOppgaveModalProps) {
  const { oppgave, onClose } = props

  const mapper = useOppgaveMapper()
  const nøkkelord = useOppgaveNøkkelord()
  const { behandlere } = useOppgavebehandlere(oppgave.oppgaveId)

  const saksbehandlerOptions = useMemo(() => {
    const options = behandlere.map((behandler) => ({ label: behandler.navn, value: behandler.id }))
    const gjeldende = oppgave.tildeltSaksbehandler
    if (gjeldende && !options.some((option) => option.value === gjeldende.id)) {
      options.unshift({ label: gjeldende.navn, value: gjeldende.id })
    }
    return [{ label: '(Ikke tildelt)', value: '' }, ...options]
  }, [behandlere, oppgave.tildeltSaksbehandler])

  const defaultValues = useMemo<EndreOppgaveSkjemaverdier>(
    () => ({
      behandlingstema: oppgave.kategorisering.behandlingstema?.kode ?? '',
      behandlingstype: oppgave.kategorisering.behandlingstype?.kode ?? '',
      prioritet: oppgave.prioritet,
      nøkkelord: oppgave.nøkkelord ?? [],
      mappeId: oppgave.mappeId ?? '',
      tildeltSaksbehandler: oppgave.tildeltSaksbehandler?.id ?? '',
      aktivDato: tilDato(oppgave.aktivDato),
      fristDato: tilDato(oppgave.fristDato),
      kommentar: '',
    }),
    [oppgave]
  )

  const form = useForm<EndreOppgaveSkjemaverdier>({ defaultValues })

  const aktivDato = form.watch('aktivDato')
  const behandlingstype = form.watch('behandlingstype')
  const tildeltSaksbehandler = form.watch('tildeltSaksbehandler')

  const { datepickerProps: datepickerPropsAktivDato, inputProps: inputPropsAktivDato } = useDatepicker({
    defaultSelected: defaultValues.aktivDato,
    onDateChange: (date) => {
      form.setValue('aktivDato', date, { shouldDirty: true })
      form.clearErrors(['aktivDato', 'fristDato'])
    },
  })

  const { datepickerProps: datepickerPropsFristDato, inputProps: inputPropsFristDato } = useDatepicker({
    fromDate: aktivDato,
    defaultSelected: defaultValues.fristDato,
    onDateChange: (date) => {
      form.setValue('fristDato', date, { shouldDirty: true })
      form.clearErrors('fristDato')
    },
  })

  const { patchOppgave } = useOppgaveActions(oppgave)
  const mutateOppgaver = useMutateOppgaver()
  const { showSuccessToast, showErrorToast } = useToast()

  const handleSubmit = form.handleSubmit(async (data) => {
    if (!data.aktivDato) {
      form.setError('aktivDato', { type: 'required', message: 'Du må velge en aktiv dato' })
      return
    }
    if (data.fristDato && isBefore(data.fristDato, data.aktivDato)) {
      form.setError('fristDato', { type: 'validate', message: 'Frist kan ikke være før aktiv dato' })
      return
    }

    const body = lagPatchOppgaveRequest(defaultValues, data)
    if (Object.keys(body).length === 0) {
      form.setError('root', { type: 'validate', message: 'Du har ikke gjort noen endringer' })
      return
    }

    try {
      await patchOppgave.trigger(body)
    } catch {
      showErrorToast('Endringene ble ikke lagret')
      return
    }
    await Promise.all([
      mutateOppgaver(),
      mutateOppgave(oppgave.oppgaveId),
      body.kommentar ? mutateOppgavekommentarer(oppgave.oppgaveId) : undefined,
    ])
    showSuccessToast('Endringene ble lagret')
    onClose()
  })

  return (
    <FormProvider {...form}>
      <FormModal
        open
        onClose={onClose}
        heading="Endre oppgaven"
        submitButtonLabel="Lagre endringer"
        width="600px"
        onSubmit={handleSubmit}
      >
        <VStack gap="space-16">
          <Controller
            name="behandlingstema"
            control={form.control}
            render={({ field }) => (
              <GjelderCombobox
                ref={field.ref}
                name={field.name}
                label="Gjelder"
                size="small"
                onBlur={field.onBlur}
                value={{ behandlingstema: field.value, behandlingstype }}
                onChange={({ behandlingstema, behandlingstype }) => {
                  form.setValue('behandlingstype', behandlingstype, { shouldDirty: true })
                  field.onChange(behandlingstema)
                }}
              />
            )}
          />

          <DatePicker {...datepickerPropsAktivDato}>
            <DatePicker.Input
              {...inputPropsAktivDato}
              label="Aktiv dato"
              size="small"
              error={form.formState.errors.aktivDato?.message}
            />
          </DatePicker>

          <DatePicker {...datepickerPropsFristDato}>
            <DatePicker.Input
              {...inputPropsFristDato}
              label="Frist dato"
              size="small"
              error={form.formState.errors.fristDato?.message}
            />
          </DatePicker>

          <Select label="Prioritet" size="small" {...form.register('prioritet')}>
            {Object.values(Oppgaveprioritet).map((prioritet) => (
              <option key={prioritet} value={prioritet}>
                {OppgaveprioritetLabel[prioritet]}
              </option>
            ))}
          </Select>

          <Controller
            name="nøkkelord"
            control={form.control}
            rules={{
              validate: (verdier) =>
                verdier.every((verdi) => verdi.length <= MAKS_LENGDE_NØKKELORD) ||
                `Nøkkelord kan ikke være lengre enn ${MAKS_LENGDE_NØKKELORD} tegn`,
            }}
            render={({ field, fieldState }) => (
              <UNSAFE_Combobox
                label="Nøkkelord"
                description="Velg eller skriv inn nye nøkkelord"
                size="small"
                error={fieldState.error?.message}
                isMultiSelect
                allowNewValues
                options={[...new Set([...nøkkelord, ...defaultValues.nøkkelord])]}
                selectedOptions={field.value}
                maxSelected={2}
                onToggleSelected={(value, isSelected) => {
                  field.onChange(
                    isSelected ? [...field.value, value] : field.value.filter((nøkkelord) => nøkkelord !== value)
                  )
                }}
              />
            )}
          />

          <HStack gap="space-8" align="end" wrap={false}>
            <Box flexGrow="1">
              <ComboboxController
                control={form.control}
                name="tildeltSaksbehandler"
                label="Tildelt saksbehandler"
                size="small"
                options={saksbehandlerOptions}
              />
            </Box>
            <Button
              type="button"
              variant="tertiary"
              data-color="neutral"
              size="small"
              icon={<PersonMinusIcon aria-hidden />}
              title="Fjern tildelt saksbehandler"
              aria-label="Fjern tildelt saksbehandler"
              disabled={!tildeltSaksbehandler}
              onClick={() => form.setValue('tildeltSaksbehandler', '', { shouldDirty: true })}
            />
          </HStack>

          <Select label="Mappe" size="small" {...form.register('mappeId')}>
            <option value="">Ingen mappe</option>
            {mapper.map((mappe) => (
              <option key={mappe.id} value={mappe.id.toString()}>
                {mappe.navn}
              </option>
            ))}
          </Select>

          <Textarea
            label="Kommentar (valgfri)"
            size="small"
            maxLength={2000}
            minRows={3}
            maxRows={6}
            {...form.register('kommentar')}
          />

          {form.formState.errors.root && <ErrorMessage size="small">{form.formState.errors.root.message}</ErrorMessage>}
        </VStack>
      </FormModal>
    </FormProvider>
  )
}

/**
 * Lager PATCH-request med kun feltene som faktisk er endret, i tillegg til eventuell kommentar.
 */
function lagPatchOppgaveRequest(
  opprinnelig: EndreOppgaveSkjemaverdier,
  endret: EndreOppgaveSkjemaverdier
): PatchOppgaveRequest {
  const body: PatchOppgaveRequest = {}

  if (
    endret.behandlingstema !== opprinnelig.behandlingstema ||
    endret.behandlingstype !== opprinnelig.behandlingstype
  ) {
    body.behandlingstema = endret.behandlingstema
    body.behandlingstype = endret.behandlingstype
  }

  if (endret.prioritet !== opprinnelig.prioritet) {
    body.prioritet = endret.prioritet
  }

  if (!erLike(endret.nøkkelord, opprinnelig.nøkkelord)) {
    body.nøkkelord = endret.nøkkelord
  }

  if (endret.mappeId !== opprinnelig.mappeId) {
    body.mappeId = endret.mappeId || null
  }

  if (endret.tildeltSaksbehandler !== opprinnelig.tildeltSaksbehandler) {
    body.tildeltSaksbehandler = endret.tildeltSaksbehandler || null
  }

  const aktivDato = endret.aktivDato && tilLocalDateString(endret.aktivDato)
  if (aktivDato && aktivDato !== (opprinnelig.aktivDato && tilLocalDateString(opprinnelig.aktivDato))) {
    body.aktivDato = aktivDato
  }

  const fristDato = endret.fristDato && tilLocalDateString(endret.fristDato)
  if (fristDato && fristDato !== (opprinnelig.fristDato && tilLocalDateString(opprinnelig.fristDato))) {
    body.fristDato = fristDato
  }

  if (isNotBlank(endret.kommentar)) {
    body.kommentar = endret.kommentar.trim()
  }

  return body
}

function erLike(a: ReadonlyArray<string>, b: ReadonlyArray<string>): boolean {
  if (a.length !== b.length) return false
  const sortertB = [...b].sort()
  return [...a].sort().every((value, index) => value === sortertB[index])
}

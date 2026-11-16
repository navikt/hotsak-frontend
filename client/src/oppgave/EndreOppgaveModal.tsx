import { DatePicker, ErrorMessage, Select, Textarea, UNSAFE_Combobox, useDatepicker, VStack } from '@navikt/ds-react'
import { isBefore } from 'date-fns'
import { useMemo } from 'react'
import { Controller, FormProvider, useForm } from 'react-hook-form'

import { FormModal } from '../felleskomponenter/modal/FormModal.tsx'
import { ComboboxController } from '../felleskomponenter/skjema/ComboboxController.tsx'
import { useToast } from '../felleskomponenter/toast/useToast.ts'
import { useMutateOppgaver } from '../oppgaveliste/useMutateOppgaver.ts'
import { naturalBy } from '../utils/array.ts'
import { tilDato, tilLocalDateString } from '../utils/dato.ts'
import { isNotBlank } from '../utils/type.ts'
import { mutateOppgavekommentarer } from './kommentar/useOppgavekommentarer.ts'
import { type Oppgave } from './oppgaveTypes.ts'
import { mutateOppgave, useOppgaveMapper } from './useOppgave.ts'
import { useOppgavebehandlere } from './useOppgavebehandlere.ts'
import { harBehandlingstema, useKodeverkGjelder } from './useKodeverkOppgave.ts'
import { type PatchOppgaveRequest, useOppgaveActions } from './useOppgaveActions.ts'

export interface EndreOppgaveModalProps {
  oppgave: Oppgave
  onClose(): void
}

interface EndreOppgaveSkjemaverdier {
  behandlingstema: string
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
  const { behandlere } = useOppgavebehandlere(oppgave.oppgaveId)
  const kodeverkGjelder = useKodeverkGjelder(oppgave.kategorisering.behandlingstype?.kode)

  const behandlingstemaOptions = useMemo(() => {
    const options = new Map(
      kodeverkGjelder
        .filter(harBehandlingstema)
        .map<[string, string]>(({ behandlingstema: { kode, term } }) => [kode, term])
    )
    const gjeldende = oppgave.kategorisering.behandlingstema
    if (gjeldende && !options.has(gjeldende.kode)) {
      options.set(gjeldende.kode, gjeldende.term)
    }
    return Array.from(options).sort(naturalBy(([, term]) => term))
  }, [kodeverkGjelder, oppgave.kategorisering.behandlingstema])

  const saksbehandlerOptions = useMemo(() => {
    const options = behandlere.map((behandler) => ({ label: behandler.navn, value: behandler.id }))
    const gjeldende = oppgave.tildeltSaksbehandler
    if (gjeldende && !options.some((option) => option.value === gjeldende.id)) {
      options.unshift({ label: gjeldende.navn, value: gjeldende.id })
    }
    return options
  }, [behandlere, oppgave.tildeltSaksbehandler])

  const defaultValues = useMemo<EndreOppgaveSkjemaverdier>(
    () => ({
      behandlingstema: oppgave.kategorisering.behandlingstema?.kode ?? '',
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
        heading="Endre oppgave"
        submitButtonLabel="Lagre endringer"
        width="600px"
        onSubmit={handleSubmit}
      >
        <VStack gap="space-16">
          <Select label="Gjelder" size="small" {...form.register('behandlingstema')}>
            {!defaultValues.behandlingstema && <option value="">Velg hva oppgaven gjelder</option>}
            {behandlingstemaOptions.map(([kode, term]) => (
              <option key={kode} value={kode}>
                {term}
              </option>
            ))}
          </Select>

          <Controller
            name="nøkkelord"
            control={form.control}
            render={({ field }) => (
              <UNSAFE_Combobox
                label="Nøkkelord"
                description="Velg eller skriv inn nye nøkkelord"
                size="small"
                isMultiSelect
                allowNewValues
                options={defaultValues.nøkkelord}
                selectedOptions={field.value}
                onToggleSelected={(value, isSelected) => {
                  field.onChange(
                    isSelected ? [...field.value, value] : field.value.filter((nøkkelord) => nøkkelord !== value)
                  )
                }}
              />
            )}
          />

          <Select label="Mappe" size="small" {...form.register('mappeId')}>
            <option value="">Ingen mappe</option>
            {mapper.map((mappe) => (
              <option key={mappe.id} value={mappe.id.toString()}>
                {mappe.navn}
              </option>
            ))}
          </Select>

          <ComboboxController
            control={form.control}
            name="tildeltSaksbehandler"
            label="Tildelt saksbehandler"
            size="small"
            options={saksbehandlerOptions}
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
              label="Frist"
              size="small"
              error={form.formState.errors.fristDato?.message}
            />
          </DatePicker>

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

  if (endret.behandlingstema && endret.behandlingstema !== opprinnelig.behandlingstema) {
    body.behandlingstema = endret.behandlingstema
  }

  if (!erLike(endret.nøkkelord, opprinnelig.nøkkelord)) {
    body.nøkkelord = endret.nøkkelord
  }

  if (endret.mappeId !== opprinnelig.mappeId) {
    body.mappeId = endret.mappeId || null
  }

  if (endret.tildeltSaksbehandler && endret.tildeltSaksbehandler !== opprinnelig.tildeltSaksbehandler) {
    body.tildeltSaksbehandler = endret.tildeltSaksbehandler
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

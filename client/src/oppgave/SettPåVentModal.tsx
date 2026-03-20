import { Checkbox, DatePicker, Textarea, useDatepicker, VStack } from '@navikt/ds-react'
import { addDays } from 'date-fns'
import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { OppgaveModalType, useOppgaveContext, useOppgaveLukkModalHandler } from './OppgaveContext.ts'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { useOppgaveActions } from './useOppgaveActions.ts'
import { FormModal } from '../felleskomponenter/modal/FormModal.tsx'
import { isNotBlank } from '../utils/type.ts'
import { tilLocalDateString } from '../utils/dato.ts'
import { Eksperiment } from '../felleskomponenter/Eksperiment.tsx'

export function SettPåVentModal() {
  const { gjeldendeEnhet } = useInnloggetAnsatt()

  const { åpenModal } = useOppgaveContext()
  const lukkModal = useOppgaveLukkModalHandler()

  const tomorrow = useMemo(() => addDays(new Date(), 1), [])
  const form = useForm({
    defaultValues: {
      aktivDato: tomorrow,
      fristFerdigstillelse: tomorrow,
      leggTilbake: false,
      kommentar: '',
    },
  })

  const { datepickerProps: datepickerPropsAktivDato, inputProps: inputPropsAktivDato } = useDatepicker({
    fromDate: tomorrow,
    defaultSelected: tomorrow,
    onDateChange: (date) => form.setValue('aktivDato', date ?? tomorrow),
  })

  const { datepickerProps: datepickerPropsFristFerdigstillelse, inputProps: inputPropsFristFerdigstillelse } =
    useDatepicker({
      fromDate: tomorrow,
      defaultSelected: tomorrow,
      onDateChange: (date) => form.setValue('fristFerdigstillelse', date ?? tomorrow),
    })

  const { endreOppgave } = useOppgaveActions()
  const handleSubmit = form.handleSubmit(async (data) => {
    await endreOppgave({
      aktivDato: tilLocalDateString(data.aktivDato),
      fristFerdigstillelse: tilLocalDateString(data.fristFerdigstillelse),
      kommentar: isNotBlank(data.kommentar) ? data.kommentar : undefined,
    })
    if (data.leggTilbake) {
      // todo
    }
    lukkModal()
  })

  return (
    <FormProvider {...form}>
      <FormModal
        open={åpenModal === OppgaveModalType.SETT_PÅ_VENT}
        onClose={lukkModal}
        heading="Sett oppgaven på vent"
        submitButtonLabel="Sett på vent"
        onSubmit={handleSubmit}
      >
        <VStack gap="space-12">
          <DatePicker {...datepickerPropsAktivDato}>
            <DatePicker.Input {...inputPropsAktivDato} label="Sett på vent til" size="small" />
          </DatePicker>
          <DatePicker {...datepickerPropsFristFerdigstillelse}>
            <DatePicker.Input {...inputPropsFristFerdigstillelse} label="Frist" size="small" />
          </DatePicker>
          <Eksperiment>
            <Checkbox size="small">{`Legg tilbake til ${gjeldendeEnhet.navn}`}</Checkbox>
          </Eksperiment>
          <Textarea
            size="small"
            label="Kommentar (valgfri)"
            maxLength={2000}
            minRows={3}
            maxRows={3}
            {...form.register('kommentar')}
          />
        </VStack>
      </FormModal>
    </FormProvider>
  )
}

import { DatePicker, useDatepicker } from '@navikt/ds-react'
import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { OppgaveModalType, useOppgaveContext, useOppgaveLukkModalHandler } from './OppgaveContext.ts'
import { useOppgaveActions } from './useOppgaveActions.ts'
import { FormModal } from '../felleskomponenter/modal/FormModal.tsx'
import { tilLocalDateString } from '../utils/dato.ts'

export function FortsettBehandlingModal() {
  const { åpenModal } = useOppgaveContext()
  const lukkModal = useOppgaveLukkModalHandler()

  const today = useMemo(() => new Date(), [])
  const form = useForm({
    defaultValues: {
      fristFerdigstillelse: today,
    },
  })

  const { datepickerProps: datepickerPropsFristFerdigstillelse, inputProps: inputPropsFristFerdigstillelse } =
    useDatepicker({
      fromDate: today,
      defaultSelected: today,
      onDateChange: (date) => form.setValue('fristFerdigstillelse', date ?? today),
    })

  const { endreOppgave } = useOppgaveActions()
  const handleSubmit = form.handleSubmit(async (data) => {
    await endreOppgave({
      aktivDato: tilLocalDateString(today),
      fristFerdigstillelse: tilLocalDateString(data.fristFerdigstillelse),
    })
    lukkModal()
  })

  return (
    <FormProvider {...form}>
      <FormModal
        open={åpenModal === OppgaveModalType.FORTSETT_BEHANDLING}
        onClose={lukkModal}
        heading="Fortsett behandling"
        submitButtonLabel="Fortsett behandling"
        onSubmit={handleSubmit}
      >
        <DatePicker {...datepickerPropsFristFerdigstillelse}>
          <DatePicker.Input {...inputPropsFristFerdigstillelse} label="Oppdatert frist" size="small" />
        </DatePicker>
      </FormModal>
    </FormProvider>
  )
}

import { DatePicker, useDatepicker } from '@navikt/ds-react'
import { useMemo } from 'react'
import { FormProvider, useForm } from 'react-hook-form'

import { FormModal } from '../felleskomponenter/modal/FormModal.tsx'
import { useToast } from '../felleskomponenter/toast/useToast'
import { useUmami } from '../sporing/useUmami.ts'
import { tilLocalDateString } from '../utils/dato.ts'
import { OppgaveModalType, useOppgaveContext, useOppgaveLukkModalHandler } from './OppgaveContext.ts'
import { type Oppgave } from './oppgaveTypes.ts'
import { useOppgaveActions } from './useOppgaveActions.ts'

export function FortsettBehandlingModal({ oppgave }: { oppgave: Oppgave }) {
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

  const { endreOppgave } = useOppgaveActions(oppgave)
  const { logOppgaveGjenopptatt } = useUmami()
  const { showSuccessToast } = useToast()
  const handleSubmit = form.handleSubmit(async (data) => {
    await endreOppgave({
      aktivDato: tilLocalDateString(today),
      fristFerdigstillelse: tilLocalDateString(data.fristFerdigstillelse),
    })
    logOppgaveGjenopptatt()
    showSuccessToast('Oppgaven ble gjenopptatt')
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

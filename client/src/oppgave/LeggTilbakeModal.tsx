import { Textarea } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'

import { OppgaveModalType, useOppgaveContext, useOppgaveLukkModalHandler } from './OppgaveContext.ts'
import { useOppgaveActions } from './useOppgaveActions.ts'
import { FormModal } from '../felleskomponenter/modal/FormModal.tsx'
import { useUmami } from '../sporing/useUmami.ts'
import { useToast } from '../felleskomponenter/toast/ToastContext.tsx'

export function LeggTilbakeModal() {
  const { åpenModal } = useOppgaveContext()
  const lukkModal = useOppgaveLukkModalHandler()

  const form = useForm({
    defaultValues: {
      kommentar: '',
    },
  })

  const { fjernOppgavetildeling } = useOppgaveActions()
  const { logOppgaveLagtTilbake } = useUmami()
  const { showSuccessToast } = useToast()
  const handleSubmit = form.handleSubmit(async () => {
    await fjernOppgavetildeling()
    logOppgaveLagtTilbake()
    showSuccessToast('Oppgaven ble lagt tilbake til felles oppgavekø')
    lukkModal()
  })

  return (
    <FormProvider {...form}>
      <FormModal
        open={åpenModal === OppgaveModalType.LEGG_TILBAKE}
        onClose={lukkModal}
        heading="Legg tilbake til felles oppgavekø"
        submitButtonLabel="Legg tilbake i køen"
        onSubmit={handleSubmit}
      >
        <Textarea
          size="small"
          label="Kommentar (valgfri)"
          maxLength={2000}
          minRows={3}
          maxRows={3}
          {...form.register('kommentar')}
        />
      </FormModal>
    </FormProvider>
  )
}

import { Textarea } from '@navikt/ds-react'
import { FormProvider, useForm } from 'react-hook-form'

import { FormModal } from '../felleskomponenter/modal/FormModal.tsx'
import { OppgaveModalType, useOppgaveContext, useOppgaveLukkModalHandler } from './OppgaveContext.ts'
import { type Oppgave } from './oppgaveTypes.ts'
import { useOppgaveActions } from './useOppgaveActions.ts'

export function LeggTilbakeModal({ oppgave }: { oppgave: Oppgave }) {
  const { åpenModal } = useOppgaveContext()
  const lukkModal = useOppgaveLukkModalHandler()

  const form = useForm({
    defaultValues: {
      kommentar: '',
    },
  })

  const { fjernOppgavetildeling } = useOppgaveActions(oppgave)
  const handleSubmit = form.handleSubmit(async () => {
    await fjernOppgavetildeling.trigger()
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

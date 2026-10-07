import { FormProvider, useForm } from 'react-hook-form'
import { type Oppgave } from '../oppgave/oppgaveTypes'
import { useOppgaveMapper } from '../oppgave/useOppgave'
import { useOppgaveActions } from '../oppgave/useOppgaveActions'
import { useMutateOppgaver } from '../oppgaveliste/useMutateOppgaver'
import { FormModal } from './modal/FormModal'
import { SelectController } from './skjema/SelectController'
import { useToast } from './toast/useToast'

export interface EndreMappeDialogProps {
  oppgave: Oppgave
  onClose: () => void
}

export function EndreMappeDialog({ oppgave, onClose }: EndreMappeDialogProps) {
  const mapper = useOppgaveMapper()
  const mutateOppgaver = useMutateOppgaver()
  const form = useForm<{ mappe: string }>({
    defaultValues: {
      mappe: oppgave.mappeId ?? '',
    },
  })
  const { endreOppgave } = useOppgaveActions(oppgave)
  const { showSuccessToast } = useToast()
  const handleSubmit = form.handleSubmit(async (data) => {
    const { mappe: nyMappeId } = data
    await endreOppgave.trigger({ mappeId: nyMappeId || null })
    await mutateOppgaver()
    showSuccessToast('Mappe endret for oppgave')
    onClose()
  })

  return (
    <FormProvider {...form}>
      <FormModal
        open
        onClose={onClose}
        heading="Endre mappe for oppgave"
        submitButtonLabel="Lagre endringer"
        onSubmit={handleSubmit}
      >
        <SelectController control={form.control} id="mappe" name="mappe" label="Velg mappe" size="small">
          <option value="">Ingen mappe</option>
          {mapper.map((mappe) => (
            <option key={mappe.id} value={mappe.id.toString()}>
              {mappe.navn}
            </option>
          ))}
        </SelectController>
      </FormModal>
    </FormProvider>
  )
}

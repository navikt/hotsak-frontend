import { useMemo } from 'react'

import type { Oppgave } from './oppgaveTypes'
import { OppgaveModalType, useOppgaveContext, useOppgaveLukkModalHandler } from './OppgaveContext.ts'
import { harBehandlingstema, useKodeverkGjelder } from './useKodeverkOppgave.ts'
import { naturalBy } from '../utils/array.ts'
import { FormProvider, useForm } from 'react-hook-form'
import { FormModal } from '../felleskomponenter/modal/FormModal.tsx'
import { useOppgaveActions } from './useOppgaveActions.ts'
import { useToast } from '../felleskomponenter/toast/ToastContext.tsx'
import { SelectController } from '../felleskomponenter/skjema/SelectController.tsx'

export interface EndreBehandlingstemaModalProps {
  oppgave: Oppgave
}

export function EndreBehandlingstemaModal(props: EndreBehandlingstemaModalProps) {
  const { oppgave } = props

  const { åpenModal } = useOppgaveContext()
  const lukkModal = useOppgaveLukkModalHandler()

  const kodeverkGjelder = useKodeverkGjelder(oppgave.kategorisering.behandlingstype?.kode)
  const behandlingstemaer = useMemo(
    () =>
      kodeverkGjelder
        .filter(harBehandlingstema)
        .map((it) => it.behandlingstema)
        .sort(naturalBy((it) => it?.term)),
    [kodeverkGjelder]
  )

  const form = useForm<{ behandlingstema: string }>({
    defaultValues: {
      behandlingstema: oppgave.kategorisering.behandlingstema?.kode ?? '',
    },
  })

  const { endreOppgave } = useOppgaveActions()
  const { showSuccessToast } = useToast()
  const handleSubmit = form.handleSubmit(async (data) => {
    await endreOppgave({ behandlingstema: data.behandlingstema })
    showSuccessToast('Behandlingstema ble endret')
    lukkModal()
  })

  return (
    <FormProvider {...form}>
      <FormModal
        open={åpenModal === OppgaveModalType.ENDRE_BEHANDLINGSTEMA}
        onClose={lukkModal}
        heading="Endre hva oppgaven gjelder"
        submitButtonLabel="Lagre endringer"
        onSubmit={handleSubmit}
      >
        <SelectController
          control={form.control}
          id="behandlingstema"
          name="behandlingstema"
          label="Velg hva oppgaven gjelder"
          size="small"
        >
          {behandlingstemaer.map((behandlingstema) => (
            <option key={behandlingstema.kode} value={behandlingstema.kode}>
              {behandlingstema.term}
            </option>
          ))}
        </SelectController>
      </FormModal>
    </FormProvider>
  )
}

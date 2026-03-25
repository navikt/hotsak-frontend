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
import { useUmami } from '../sporing/useUmami.ts'

export interface EndreGjelderModalProps {
  oppgave: Oppgave
}

export function EndreGjelderModal(props: EndreGjelderModalProps) {
  const { oppgave } = props

  const { åpenModal } = useOppgaveContext()
  const lukkModal = useOppgaveLukkModalHandler()

  const kodeverkGjelder = useKodeverkGjelder(oppgave.kategorisering.behandlingstype?.kode)
  const behandlingstemaTermByKode = useMemo(() => {
    return new Map(
      kodeverkGjelder
        .filter(harBehandlingstema)
        .map<[string, string]>(({ behandlingstema: { kode, term } }) => [kode, term])
        .sort(naturalBy(([, term]) => term))
    )
  }, [kodeverkGjelder])

  const gjeldendeBehandlingstema = oppgave.kategorisering.behandlingstema
  const form = useForm<{ behandlingstema: string }>({
    defaultValues: {
      behandlingstema: gjeldendeBehandlingstema?.kode ?? '',
    },
  })

  const { endreOppgave } = useOppgaveActions()
  const { logOppgaveGjelderEndret } = useUmami()
  const { showSuccessToast } = useToast()
  const handleSubmit = form.handleSubmit(async (data) => {
    const { behandlingstema: nyBehandlingstemaKode } = data
    await endreOppgave({ behandlingstema: nyBehandlingstemaKode })
    logOppgaveGjelderEndret({
      fra: gjeldendeBehandlingstema?.term,
      til: behandlingstemaTermByKode.get(nyBehandlingstemaKode),
    })
    showSuccessToast('Endringene ble lagret')
    lukkModal()
  })

  return (
    <FormProvider {...form}>
      <FormModal
        open={åpenModal === OppgaveModalType.ENDRE_GJELDER}
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
          {Array.from(behandlingstemaTermByKode).map(([kode, term]) => (
            <option key={kode} value={kode}>
              {term}
            </option>
          ))}
        </SelectController>
      </FormModal>
    </FormProvider>
  )
}

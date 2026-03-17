import { Skeleton, Textarea, VStack } from '@navikt/ds-react'
import { useEffect } from 'react'

import { FormProvider, useForm } from 'react-hook-form'
import { FormModal } from '../felleskomponenter/modal/FormModal.tsx'
import { SelectController } from '../felleskomponenter/skjema/SelectController.tsx'
import { useToast } from '../felleskomponenter/toast/ToastContext.tsx'
import { Tekst } from '../felleskomponenter/typografi.tsx'
import { http } from '../io/HttpClient.ts'
import { useNotater } from '../saksbilde/høyrekolonne/notat/useNotater.tsx'
import { InfoModal } from '../saksbilde/komponenter/InfoModal.tsx'
import { useUmami } from '../sporing/useUmami.ts'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { isNotBlank } from '../utils/type.ts'
import { OppgaveModalType, useOppgaveContext, useOppgaveLukkModalHandler } from './OppgaveContext.ts'
import { useOppgaveActions } from './useOppgaveActions.ts'
import { useOppgavebehandlere } from './useOppgavebehandlere.ts'

export interface OverførTilMedarbeiderModalProps {
  sakId: string
}

export function OverførTilMedarbeiderModal(props: OverførTilMedarbeiderModalProps) {
  const { sakId } = props
  const { harUtkast } = useNotater(sakId)
  const { behandlere, mutate: mutateBehandlere, isValidating: behandlereIsValidating } = useOppgavebehandlere()
  const { gjeldendeEnhet } = useInnloggetAnsatt()

  const { åpenModal } = useOppgaveContext()
  const lukkModal = useOppgaveLukkModalHandler()
  const open = åpenModal === OppgaveModalType.OVERFØR_TIL_MEDARBEIDER

  const form = useForm({
    defaultValues: {
      valgtSaksbehandler: '',
      kommentar: '',
    },
  })
  const { formState, register } = form

  const { endreOppgavetildeling } = useOppgaveActions()
  const { showSuccessToast } = useToast()
  const { logOverføringMedarbeider } = useUmami()

  useEffect(() => {
    if (open) {
      // noinspection JSIgnoredPromiseFromCall
      mutateBehandlere()
    }
  }, [open, mutateBehandlere])

  if (harUtkast) {
    return (
      <InfoModal open={open} heading="Saken kan ikke overføres til medarbeider" onClose={lukkModal}>
        Du har et utkast til notat som må ferdigstilles eller slettes.
      </InfoModal>
    )
  }

  const handleSubmit = form.handleSubmit(async (data) => {
    //fjerner ferdigstilling av brev
    await http.delete(`/api/sak/${sakId}/brevutkast/BREVEDITOR_VEDTAKSBREV/ferdigstilling`)

    await endreOppgavetildeling({
      saksbehandlerId: data.valgtSaksbehandler,
      melding: isNotBlank(data.kommentar) ? data.kommentar : null,
    })

    logOverføringMedarbeider()
    showSuccessToast('Oppgaven ble overført')
    lukkModal()
  })

  return (
    <FormProvider {...form}>
      <FormModal
        open={open}
        onClose={lukkModal}
        heading="Overfør til medarbeider"
        submitButtonLabel="Overfør oppgave"
        onSubmit={handleSubmit}
      >
        {behandlereIsValidating ? (
          <>
            <Skeleton height={52} />
            <Skeleton height={52} />
            <Skeleton height={134} />
          </>
        ) : (
          <VStack gap="space-16">
            <Tekst>{`Du kan velge blant medarbeidere ved ${gjeldendeEnhet.navn} som har tilgang til Hotsak.`}</Tekst>
            <SelectController
              control={form.control}
              id="valgtSaksbehandler"
              name="valgtSaksbehandler"
              label="Medarbeider"
              size="small"
              error={formState.errors.valgtSaksbehandler?.message}
              rules={{ required: 'Du må velge en medarbeider' }}
            >
              <option value="">Velg medarbeider</option>
              {behandlere.map((behandler) => (
                <option key={behandler.id} value={behandler.id}>
                  {behandler.navn}
                </option>
              ))}
            </SelectController>
            <Textarea
              id="kommentar"
              label="Kommentar (valgfri)"
              description="Kommentaren blir synlig i sakshistorikken."
              size="small"
              error={formState.errors.kommentar?.message}
              maxLength={2000}
              minRows={5}
              maxRows={5}
              {...register('kommentar')}
            />
          </VStack>
        )}
      </FormModal>
    </FormProvider>
  )
}

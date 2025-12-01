import { ErrorSummary, Select, Skeleton, Textarea, VStack } from '@navikt/ds-react'
import { ErrorSummaryItem } from '@navikt/ds-react/ErrorSummary'
import { useEffect } from 'react'

import { FormModal } from '../felleskomponenter/modal/FormModal.tsx'
import { Tekst } from '../felleskomponenter/typografi.tsx'
import { useNotater } from '../saksbilde/høyrekolonne/notat/useNotater.tsx'
import { InfoModal } from '../saksbilde/komponenter/InfoModal.tsx'
import { mutateSak } from '../saksbilde/mutateSak.ts'
import { useInnloggetAnsatt } from '../tilgang/useTilgang.ts'
import { useFormActionState } from '../utils/form.ts'
import { isNotBlank } from '../utils/type.ts'
import { useOppgaveActions } from './useOppgaveActions.ts'
import { useOppgavebehandlere } from './useOppgavebehandlere.ts'
import { useToast } from '../felleskomponenter/toast/ToastContext.tsx'
import { useUmami } from '../sporing/useUmami.ts'

export function OverførOppgaveTilMedarbeiderModal(props: { sakId: string; enhet: string; open: boolean; onClose(): void }) {
  const { sakId, enhet, open, onClose } = props
  const { behandlere, mutate: mutateBehandlere, isValidating: behandlereIsValidating } = useOppgavebehandlere()
  const { harUtkast } = useNotater(sakId)
  const [state, formAction] = useOverførOppgaveTilMedarbeiderActionState(sakId, enhet)
  const { gjeldendeEnhet } = useInnloggetAnsatt()

  useEffect(() => {
    if (open) {
      // noinspection JSIgnoredPromiseFromCall
      mutateBehandlere()
    }
  }, [open, mutateBehandlere])

  useEffect(() => {
    if (state.success) {
      onClose()
    }
  }, [state])

  if (harUtkast) {
    return (
      <InfoModal open={open} heading="Saken kan ikke overføres til medarbeider" onClose={onClose}>
        Du har et utkast til notat som må ferdigstilles eller slettes.
      </InfoModal>
    )
  }

  return (
    <FormModal
      open={open}
      heading="Overfør til medarbeider"
      submitButtonLabel="Overfør sak"
      action={formAction}
      onClose={onClose}
    >
      {behandlereIsValidating ? (
        <>
          <Skeleton height={52} />
          <Skeleton height={52} />
          <Skeleton height={134} />
        </>
      ) : (
        <VStack gap="4">
          <Tekst>Du kan velge blant medarbeidere ved {gjeldendeEnhet.navn} som har tilgang til Hotsak.</Tekst>
          <Select id="valgtSaksbehandler" name="valgtSaksbehandler" label="Medarbeider" size="small">
            <option value="">Velg medarbeider</option>
            {behandlere.map((behandler) => (
              <option key={behandler.id} value={behandler.id}>
                {behandler.navn}
              </option>
            ))}
          </Select>
          <Textarea
            name="melding"
            minRows={5}
            maxRows={5}
            label="Melding til medarbeider"
            description="Meldingen blir synlig i sakshistorikken."
            size="small"
          />
          {state.error && (
            <ErrorSummary size="small">
              <ErrorSummaryItem href="#valgtSaksbehandler">{state.error}</ErrorSummaryItem>
            </ErrorSummary>
          )}
        </VStack>
      )}
    </FormModal>
  )
}

function useOverførOppgaveTilMedarbeiderActionState(sakId: string, enhet: string) {
  const { endreOppgavetildeling } = useOppgaveActions()
  const { showSuccessToast } = useToast()
  const { logOverføringMedarbeider } = useUmami()

  return useFormActionState<
    {
      success?: boolean
      error?: string
    },
    {
      valgtSaksbehandler?: string
      melding?: string
    }
  >(async (_, payload) => {
    const { valgtSaksbehandler, melding } = payload
    if (isNotBlank(valgtSaksbehandler) && valgtSaksbehandler.length === 7) {
      await endreOppgavetildeling({
        saksbehandlerId: valgtSaksbehandler,
        melding: isNotBlank(melding) ? melding : null,
        overtaHvisTildelt: true,
      })
      await mutateSak(sakId)
      logOverføringMedarbeider({
        enhetsnavn: enhet,
      })
      showSuccessToast(`Saken er overført`)
      return { success: true }
    }
    return { success: false, error: 'Velg en medarbeider fra nedtrekksmenyen' }
  }, {})
}

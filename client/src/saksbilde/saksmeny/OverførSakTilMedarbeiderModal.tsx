import { useEffect } from 'react'
import { ErrorSummary, Select, Skeleton, Textarea, VStack } from '@navikt/ds-react'

import { useOppgavebehandlere } from '../../oppgave/useOppgavebehandlere.ts'
import { useNotater } from '../høyrekolonne/notat/useNotater.tsx'
import { InfoModal } from '../komponenter/InfoModal.tsx'
import { FormModal } from '../../felleskomponenter/modal/FormModal.tsx'
import { useOppgaveService } from '../../oppgave/OppgaveService.ts'
import { isNotBlank } from '../../utils/type.ts'
import { mutateSak } from '../mutateSak.ts'
import { useFormActionState } from '../../utils/form.ts'
import { ErrorSummaryItem } from '@navikt/ds-react/ErrorSummary'
import { useInnloggetAnsatt } from '../../tilgang/useTilgang.ts'
import { Tekst } from '../../felleskomponenter/typografi.tsx'

export function OverførSakTilMedarbeiderModal(props: { sakId: string; open: boolean; onClose(): void }) {
  const { sakId, open, onClose } = props
  const { behandlere, mutate: mutateBehandlere, isValidating: behandlereIsValidating } = useOppgavebehandlere()
  const { harUtkast } = useNotater(sakId)
  const [state, formAction] = useOverførSakTilMedarbeiderActionState(sakId)
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

function useOverførSakTilMedarbeiderActionState(sakId: string) {
  const { endreOppgavetildeling } = useOppgaveService()
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
      return { success: true }
    }
    return { success: false, error: 'Velg en medarbeider fra nedtrekksmenyen' }
  }, {})
}

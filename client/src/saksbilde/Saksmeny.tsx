import { ChevronDownIcon } from '@navikt/aksel-icons'
import { Alert, Button, Dropdown, Select, Skeleton, Textarea, VStack } from '@navikt/ds-react'
import { useActionState, useEffect, useState } from 'react'

import { useSaksregler } from '../saksregler/useSaksregler.ts'
import { mutateSak } from './mutateSak.ts'
import { useOppgavebehandlere } from '../oppgave/useOppgavebehandlere.ts'
import { useOppgaveService } from '../oppgave/OppgaveService.ts'
import { isNotBlank } from '../utils/type.ts'
import { FormModal } from '../felleskomponenter/modal/FormModal.tsx'
import { useNotater } from './høyrekolonne/notat/useNotater.tsx'
import { InfoModal } from './komponenter/InfoModal.tsx'

export function Saksmeny() {
  const { sakId, kanBehandleSak } = useSaksregler()

  const [overførTilSaksbehandler, setOverførTilSaksbehandler] = useState(false)

  if (!sakId) return null

  const saksmenyvalg: Array<{
    tekst: string
    aktiv?: boolean
    onClick?(): void | Promise<void>
  }> = [
    {
      tekst: 'Overfør til medarbeider',
      aktiv: kanBehandleSak,
      async onClick() {
        setOverførTilSaksbehandler(true)
      },
    },
  ]

  return (
    <>
      <Dropdown>
        <Button as={Dropdown.Toggle} variant="tertiary" size="xsmall" title="Saksmeny" icon={<ChevronDownIcon />}>
          Meny
        </Button>
        <Dropdown.Menu>
          <Dropdown.Menu.List>
            {saksmenyvalg.map(({ tekst, aktiv, onClick }) => (
              <Dropdown.Menu.List.Item key={tekst} disabled={!aktiv} onClick={onClick}>
                {tekst}
              </Dropdown.Menu.List.Item>
            ))}
          </Dropdown.Menu.List>
        </Dropdown.Menu>
      </Dropdown>
      <OverførTilSaksbehandlerModal
        sakId={sakId}
        open={overførTilSaksbehandler}
        onClose={() => {
          setOverførTilSaksbehandler(false)
        }}
      />
    </>
  )
}

function OverførTilSaksbehandlerModal(props: { sakId: string; open: boolean; onClose(): void }) {
  const { sakId, open, onClose } = props
  const { behandlere, mutate: mutateBehandlere, isValidating: behandlereIsValidating } = useOppgavebehandlere()
  const { harUtkast } = useNotater(sakId)
  const { state, formAction } = useOverførTilSaksbehandler(sakId)

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
      <InfoModal open={open} heading="Feilmelding" onClose={onClose}>
        <Alert variant="warning" size="small">
          Du har et utkast til notat som må ferdigstilles eller slettes.
        </Alert>
      </InfoModal>
    )
  }

  return (
    <FormModal
      open={open}
      heading="Overfør sak til annen saksbehandler"
      submitButtonLabel="Overfør sak"
      action={formAction}
      onClose={onClose}
    >
      {behandlereIsValidating ? (
        <>
          <Skeleton height={52} />
          <Skeleton height={134} />
        </>
      ) : (
        <VStack gap="4">
          <Select name="valgtSaksbehandler" label="Navn" size="small">
            <option value="">Velg saksbehandler</option>
            {behandlere.map((behandler) => (
              <option key={behandler.id} value={behandler.id}>
                {behandler.navn}
              </option>
            ))}
          </Select>
          <Textarea name="melding" minRows={5} maxRows={5} label="Melding" size="small" />
        </VStack>
      )}
    </FormModal>
  )
}

interface OverførTilSaksbehandlerState {
  success?: boolean
}

function useOverførTilSaksbehandler(sakId: string) {
  const { endreOppgavetildeling } = useOppgaveService()
  const [state, formAction] = useActionState<OverførTilSaksbehandlerState, FormData>(async (_, data) => {
    const valgtSaksbehandler = data.get('valgtSaksbehandler')
    const melding = data.get('melding')
    if (isNotBlank(valgtSaksbehandler) && valgtSaksbehandler.length === 7) {
      await endreOppgavetildeling({
        saksbehandlerId: valgtSaksbehandler,
        melding: isNotBlank(melding) ? melding : null,
        overtaHvisTildelt: true,
      })
      await mutateSak(sakId)
      return { success: true }
    }
    return { success: false }
  }, {})
  return { state, formAction }
}

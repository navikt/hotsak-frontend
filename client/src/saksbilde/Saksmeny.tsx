import { ChevronDownIcon } from '@navikt/aksel-icons'
import { Alert, Button, Checkbox, CheckboxGroup, Dropdown, Select, Textarea, VStack } from '@navikt/ds-react'
import { useEffect, useState } from 'react'

import { postHenleggelse } from '../io/http.ts'
import { useSaksregler } from '../saksregler/useSaksregler.ts'
import { BekreftelseModal } from './komponenter/BekreftelseModal.tsx'
import { mutateSak } from './mutateSak.ts'
import { useOppgavebehandlere } from '../oppgave/useOppgavebehandlere.ts'
import { useOppgaveService } from '../oppgave/OppgaveService.ts'
import type { NavIdent } from '../tilgang/Ansatt.ts'

export function Saksmeny() {
  const { sakId, kanBehandleSak } = useSaksregler()

  const [henleggSakModalOpen, setHenleggSakModalOpen] = useState(false)
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
    /*
    {
      tekst: 'Henlegg/bortfall sak',
      aktiv: kanBehandleSak,
      async onClick() {
        setHenleggSakModalOpen(true)
      },
    },
    */
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
      <HenleggSakModal
        sakId={sakId}
        open={henleggSakModalOpen}
        onClose={() => {
          setHenleggSakModalOpen(false)
        }}
      />
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

const henleggSakÅrsaker = ['Duplikat sak']

function OverførTilSaksbehandlerModal(props: { sakId: string; open: boolean; onClose(): void }) {
  const { sakId, open, onClose } = props
  const { behandlere, mutate: mutateBehandlere, isValidating: behandlereIsValidating } = useOppgavebehandlere()
  const { endreOppgavetildeling } = useOppgaveService()
  const [loading, setLoading] = useState(false)
  const [valgtSaksbehandler, setValgtSaksbehandler] = useState<NavIdent>('')
  const [melding, setMelding] = useState<string>('')

  useEffect(() => {
    if (open) {
      // noinspection JSIgnoredPromiseFromCall
      mutateBehandlere()
    }
  }, [open, mutateBehandlere])

  return (
    <BekreftelseModal
      open={open}
      loading={loading || behandlereIsValidating}
      heading="Overfør sak til annen saksbehandler"
      bekreftButtonLabel="Overfør sak"
      onBekreft={async () => {
        setLoading(true)
        await endreOppgavetildeling({
          saksbehandlerId: valgtSaksbehandler || null,
          melding: melding || null,
          overtaHvisTildelt: true,
        })
        await mutateSak(sakId)
        setLoading(false)
        setValgtSaksbehandler('')
        setMelding('')
        return onClose()
      }}
      onClose={onClose}
    >
      <VStack gap="4">
        <form role="search">
          <VStack gap="4">
            <Select
              label="Navn"
              size="small"
              value={valgtSaksbehandler}
              onChange={(event) => {
                setValgtSaksbehandler(event.target.value)
              }}
            >
              <option value="">Velg saksbehandler</option>
              {behandlere.map((behandler) => (
                <option key={behandler.id} value={behandler.id}>
                  {behandler.navn}
                </option>
              ))}
            </Select>
            <Textarea
              minRows={5}
              maxRows={5}
              label="Melding"
              size="small"
              value={melding}
              onChange={(event) => {
                setMelding(event.target.value)
              }}
            />
          </VStack>
        </form>
      </VStack>
    </BekreftelseModal>
  )
}

function HenleggSakModal(props: { sakId: string; open: boolean; onClose(): void }) {
  const { sakId, open, onClose } = props
  const [loading, setLoading] = useState(false)
  return (
    <BekreftelseModal
      open={open}
      loading={loading}
      heading="Vil du henlegge saken?"
      bekreftButtonLabel="Henlegg sak"
      onBekreft={async () => {
        setLoading(true)
        await postHenleggelse(sakId)
        await mutateSak(sakId)
        setLoading(false)
        return onClose()
      }}
      onClose={onClose}
    >
      <VStack gap="4">
        <Alert variant="info" size="small">
          Dette er bare en mockup og funker ikke på ekte i dev enda
        </Alert>
        <CheckboxGroup size="small" legend="Hvorfor skal saken henlegges?" defaultValue={henleggSakÅrsaker}>
          {henleggSakÅrsaker.map((årsak) => (
            <Checkbox key={årsak} value={årsak} readOnly>
              {årsak}
            </Checkbox>
          ))}
        </CheckboxGroup>
      </VStack>
    </BekreftelseModal>
  )
}

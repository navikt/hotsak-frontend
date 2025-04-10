import { ChevronDownIcon } from '@navikt/aksel-icons'
import { Alert, Button, Checkbox, CheckboxGroup, Dropdown, Select, VStack } from '@navikt/ds-react'
import { useState } from 'react'

import { postHenleggelse } from '../io/http.ts'
import { useSaksregler } from '../saksregler/useSaksregler.ts'
import { BekreftelseModal } from './komponenter/BekreftelseModal.tsx'
import { mutateSak } from './mutateSak.ts'

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
    {
      tekst: 'Henlegg/bortfall sak',
      aktiv: kanBehandleSak,
      async onClick() {
        setHenleggSakModalOpen(true)
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

const mockSaksbehandlere = [
  { id: '1', navIdent: 's123456', navn: 'Silje Saksbehandler' },
  { id: '2', navIdent: 'j123456', navn: 'Journalfør Journalposten' },
  { id: '3', navIdent: 'v123456', navn: 'Vurder Vilkårsen' },
  { id: '4', navIdent: 'a123456', navn: 'Noén Ándré' },
]

function OverførTilSaksbehandlerModal(props: { sakId: string; open: boolean; onClose(): void }) {
  const { sakId, open, onClose } = props
  const [loading, setLoading] = useState(false)
  return (
    <BekreftelseModal
      open={open}
      loading={loading}
      heading="Overfør sak til annen saksbehandler"
      bekreftButtonLabel="Overfør sak"
      bekreftButtonVariant="secondary"
      reverserKnapperekkefølge={true}
      avbrytButtonLabel="Avbryt"
      avbrytButtonVariant="primary"
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
        <form role="search">
          <Select label="Navn" size="small">
            {mockSaksbehandlere.map((saksbehandler) => (
              <option key={saksbehandler.id} value={saksbehandler.id}>
                {saksbehandler.navn}
              </option>
            ))}
          </Select>
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

import { ChevronDownIcon } from '@navikt/aksel-icons'
import { Button, Checkbox, CheckboxGroup, Dropdown } from '@navikt/ds-react'
import { useState } from 'react'

import { postHenleggelse } from '../io/http.ts'
import { useSaksregler } from '../saksregler/useSaksregler.ts'
import { BekreftelseModal } from './komponenter/BekreftelseModal.tsx'
import { mutateSak } from './mutateSak.ts'

export function Saksmeny() {
  const { sakId, kanHenleggeSak } = useSaksregler()

  const [henleggSakModalOpen, setHenleggSakModalOpen] = useState(false)

  if (!sakId) return null

  const saksmenyvalg: Array<{
    tekst: string
    aktiv?: boolean
    onClick?(): void | Promise<void>
  }> = [
    {
      tekst: 'Henlegg sak',
      aktiv: kanHenleggeSak(),
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
    </>
  )
}

const henleggSakÅrsaker = ['Bruker er død']

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
      <CheckboxGroup legend="Hvorfor skal saken henlegges?" defaultValue={henleggSakÅrsaker}>
        {henleggSakÅrsaker.map((årsak) => (
          <Checkbox key={årsak} value={årsak} readOnly>
            {årsak}
          </Checkbox>
        ))}
      </CheckboxGroup>
    </BekreftelseModal>
  )
}

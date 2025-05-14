import { ChevronDownIcon } from '@navikt/aksel-icons'
import { Button, Dropdown } from '@navikt/ds-react'
import { useState } from 'react'

import { useSaksregler } from '../../saksregler/useSaksregler.ts'
import { OverførSakTilMedarbeiderModal } from './OverførSakTilMedarbeiderModal.tsx'

export function Saksmeny() {
  const { sakId, kanBehandleSak } = useSaksregler()
  const [overførSakTilMedarbeider, setOverførSakTilMedarbeider] = useState(false)

  if (!sakId) return null

  const saksmenyvalg: Array<{
    tekst: string
    aktiv?: boolean
    onClick?(): void | Promise<void>
  }> = [
    {
      tekst: 'Overfør sak til medarbeider',
      aktiv: kanBehandleSak,
      onClick() {
        setOverførSakTilMedarbeider(true)
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
      <OverførSakTilMedarbeiderModal
        sakId={sakId}
        open={overførSakTilMedarbeider}
        onClose={() => {
          setOverførSakTilMedarbeider(false)
        }}
      />
    </>
  )
}

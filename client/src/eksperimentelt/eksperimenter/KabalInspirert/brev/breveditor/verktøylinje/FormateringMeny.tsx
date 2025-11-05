import { ActionMenu, Button } from '@navikt/ds-react'
import {
  ArrowRedoIcon,
  ArrowUndoIcon,
  ExpandIcon,
  FileParagraphIcon,
  LinkIcon,
  MenuElipsisVerticalCircleIcon,
  ShrinkIcon,
} from '@navikt/aksel-icons'
import { useBreveditorContext } from '../Breveditor.tsx'
import { useAngreKnapp } from './AngreKnapp.tsx'
import { useGjentaKnapp } from './GjentaKnapp.tsx'
import { useMarkKnapp } from './hjelpere/MarkKnapp.tsx'
import { useLinkKnapp } from './LinkKnapp.tsx'
import { SettInnDelmalModal } from './SettInnDelmalKnapp.tsx'
import { useState } from 'react'

const FormateringMeny = () => {
  const breveditor = useBreveditorContext()
  const erMac = window.navigator.platform.startsWith('Mac') || window.navigator.platform === 'iPhone'
  const angreKnapp = useAngreKnapp()
  const gjentaKnapp = useGjentaKnapp()
  const fetKnapp = useMarkKnapp('bold')
  const kursivKnapp = useMarkKnapp('italic')
  const underlinjeKnapp = useMarkKnapp('underline')
  const linkKnapp = useLinkKnapp()
  const [visSettInnDelmal, settVisSettInnDelmal] = useState(false)
  return (
    <div
      style={{
        margin: '0 0.5em',
      }}
    >
      <ActionMenu
        onOpenChange={(open) => {
          if (!open) breveditor.fokuserPlateContent()
        }}
      >
        <ActionMenu.Trigger>
          <Button
            variant="tertiary-neutral"
            icon={<MenuElipsisVerticalCircleIcon aria-hidden />}
            iconPosition="right"
            size="small"
            disabled={!breveditor.erBreveditorEllerVerktoylinjeFokusert}
          />
        </ActionMenu.Trigger>
        <ActionMenu.Content>
          <ActionMenu.Group label="Historikk">
            <ActionMenu.Item
              disabled={angreKnapp.disabled}
              icon={<ArrowUndoIcon fontSize="1rem" />}
              shortcut={erMac ? '⌘ + Z' : 'Ctrl + Z'}
              onSelect={angreKnapp.undo}
            >
              Angre
            </ActionMenu.Item>
            <ActionMenu.Item
              disabled={gjentaKnapp.disabled}
              icon={<ArrowRedoIcon fontSize="1rem" />}
              shortcut={erMac ? '⌘ + Shit + Z' : 'Ctrl + Y'}
              onSelect={gjentaKnapp.redo}
            >
              Gjenta
            </ActionMenu.Item>
          </ActionMenu.Group>
          <ActionMenu.Group label="Tekststil">
            <ActionMenu.Item
              icon={<span style={{ fontWeight: 'bold' }}>F</span>}
              shortcut={erMac ? '⌘ + B' : 'Ctrl + B'}
              onSelect={fetKnapp.toggle}
            >
              Fet
            </ActionMenu.Item>
            <ActionMenu.Item
              icon={
                <span
                  style={{
                    fontStyle: 'italic',
                  }}
                >
                  K
                </span>
              }
              shortcut={erMac ? '⌘ + I' : 'Ctrl + I'}
              onSelect={kursivKnapp.toggle}
            >
              Kursiv
            </ActionMenu.Item>
            <ActionMenu.Item
              icon={
                <span
                  style={{
                    textDecoration: 'underline',
                  }}
                >
                  U
                </span>
              }
              shortcut={erMac ? '⌘ + U' : 'Ctrl + U'}
              onSelect={underlinjeKnapp.toggle}
            >
              Underlinje
            </ActionMenu.Item>
            <ActionMenu.Item
              icon={<LinkIcon fontSize="1rem" />}
              shortcut={erMac ? '⌘ + K' : 'Ctrl + K'}
              onSelect={linkKnapp.onClick}
            >
              Link
            </ActionMenu.Item>
          </ActionMenu.Group>
          <ActionMenu.Group label="Annet">
            <ActionMenu.Item icon={<FileParagraphIcon fontSize="1rem" />} onSelect={() => settVisSettInnDelmal(true)}>
              Sett inn delmal
            </ActionMenu.Item>
            <ActionMenu.Item
              icon={breveditor.visMarger ? <ExpandIcon fontSize="1rem" /> : <ShrinkIcon fontSize="1rem" />}
              onSelect={() => breveditor.settVisMarger(!breveditor.visMarger)}
            >
              {breveditor.visMarger ? 'Skjul' : 'Vis'} marger
            </ActionMenu.Item>
          </ActionMenu.Group>
        </ActionMenu.Content>
      </ActionMenu>
      {visSettInnDelmal && <SettInnDelmalModal onClose={() => settVisSettInnDelmal(false)} />}
    </div>
  )
}

export default FormateringMeny

import { ActionMenu, Button } from '@navikt/ds-react'
import {
  ArrowRedoIcon,
  ArrowUndoIcon,
  BulletListIcon,
  ExpandIcon,
  FileParagraphIcon,
  LinkIcon,
  MenuElipsisVerticalCircleIcon,
  NumberListIcon,
} from '@navikt/aksel-icons'
import { useBreveditorContext } from '../Breveditor.tsx'
import { useAngreKnapp } from './AngreKnapp.tsx'
import { useGjentaKnapp } from './GjentaKnapp.tsx'

const FormateringMeny = () => {
  const breveditor = useBreveditorContext()
  const erMac = window.navigator.platform.startsWith('Mac') || window.navigator.platform === 'iPhone'
  const angreKnapp = useAngreKnapp()
  const gjentaKnapp = useGjentaKnapp()
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
            >
              Underlinje
            </ActionMenu.Item>
            <ActionMenu.Item icon={<LinkIcon fontSize="1rem" />} shortcut={erMac ? '⌘ + K' : 'Ctrl + K'}>
              Link
            </ActionMenu.Item>
          </ActionMenu.Group>
          <ActionMenu.Group label="Lister">
            <ActionMenu.Item icon={<BulletListIcon fontSize="1rem" />}>Punktliste</ActionMenu.Item>
            <ActionMenu.Item icon={<NumberListIcon fontSize="1rem" />}>Nummerert liste</ActionMenu.Item>
          </ActionMenu.Group>
          <ActionMenu.Group label="Annet">
            <ActionMenu.Item icon={<FileParagraphIcon fontSize="1rem" />}>Sett inn delmal</ActionMenu.Item>
            <ActionMenu.Item icon={<ExpandIcon fontSize="1rem" />}>Skjul marger</ActionMenu.Item>
          </ActionMenu.Group>
        </ActionMenu.Content>
      </ActionMenu>
    </div>
  )
}

export default FormateringMeny

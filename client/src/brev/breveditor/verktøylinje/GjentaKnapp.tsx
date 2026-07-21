import { ArrowRedoIcon } from '@navikt/aksel-icons'
import { Button, Tooltip } from '@navikt/ds-react'
import { useGjentaKnapp } from './useGjentaKnapp'

const GjentaKnapp = () => {
  const { disabled, redo } = useGjentaKnapp()
  return (
    <Tooltip
      content={'Gjenta'}
      keys={
        window.navigator.platform.startsWith('Mac') || window.navigator.platform === 'iPhone'
          ? ['⌘ + Shift + Z']
          : /* Usikkert om begge fungerer, på Windows skal det være med Ctrl+Y, men i koden bruker de bare isHotkey("mod+shift+z"):  */
            ['Ctrl + Y', 'Ctrl + Shift + Z']
      }
    >
      <Button
        data-umami-event="Gjentaknapp"
        data-color="neutral"
        disabled={disabled}
        onMouseDown={(event: { preventDefault: () => void }) => {
          event.preventDefault()
          redo()
        }}
        variant="tertiary"
        size="small"
        icon={<ArrowRedoIcon fontSize="1rem" />}
      />
    </Tooltip>
  )
}

export default GjentaKnapp

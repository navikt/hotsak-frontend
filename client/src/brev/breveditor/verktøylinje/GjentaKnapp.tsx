import { Button, Tooltip } from '@navikt/ds-react'
import { useEditorState } from 'platejs/react'
import { ArrowRedoIcon } from '@navikt/aksel-icons'

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

export const useGjentaKnapp = () => {
  const editor = useEditorState()
  return {
    redo: () => editor.redo(),
    disabled: editor.history.redos.length == 0,
  }
}

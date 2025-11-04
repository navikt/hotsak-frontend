import { Button, Tooltip } from '@navikt/ds-react'
import { useEditorState } from 'platejs/react'
import { ArrowRedoIcon } from '@navikt/aksel-icons'

const GjentaKnapp = ({}: {}) => {
  const editor = useEditorState()
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
        disabled={editor.history.redos.length == 0}
        onMouseDown={(event: { preventDefault: () => void }) => {
          event.preventDefault()
          editor.redo()
        }}
        variant="tertiary-neutral"
        size="small"
        icon={<ArrowRedoIcon fontSize="1rem" />}
      />
    </Tooltip>
  )
}

export default GjentaKnapp

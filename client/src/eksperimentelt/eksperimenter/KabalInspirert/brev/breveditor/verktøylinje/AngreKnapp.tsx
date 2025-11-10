import { Button, Tooltip } from '@navikt/ds-react'
import { useEditorState } from 'platejs/react'
import { ArrowUndoIcon } from '@navikt/aksel-icons'

const AngreKnapp = () => {
  const { disabled, undo } = useAngreKnapp()
  return (
    <Tooltip
      content={'Angre'}
      keys={
        window.navigator.platform.startsWith('Mac') || window.navigator.platform === 'iPhone' ? ['⌘ + Z'] : ['Ctrl + Z']
      }
    >
      <Button
        disabled={disabled}
        onMouseDown={(event: { preventDefault: () => void }) => {
          event.preventDefault()
          undo()
        }}
        variant="tertiary-neutral"
        size="small"
        icon={<ArrowUndoIcon fontSize="1rem" />}
      />
    </Tooltip>
  )
}

export default AngreKnapp

export const useAngreKnapp = () => {
  const editor = useEditorState()
  return {
    undo: () => editor.undo(),
    disabled: editor.history.undos.length == 0,
  }
}

import { Button, Tooltip } from '@navikt/ds-react'
import { useEditorState } from 'platejs/react'
import { ArrowUndoIcon } from '@navikt/aksel-icons'

const AngreKnapp = ({}: {}) => {
  const editor = useEditorState()
  return (
    <Tooltip
      content={'Angre'}
      keys={
        window.navigator.platform.startsWith('Mac') || window.navigator.platform === 'iPhone' ? ['⌘ + Z'] : ['Ctrl + Z']
      }
    >
      <Button
        disabled={editor.history.undos.length == 0}
        onMouseDown={(event: { preventDefault: () => void }) => {
          event.preventDefault()
          editor.undo()
        }}
        variant="tertiary-neutral"
        size="small"
        icon={<ArrowUndoIcon fontSize="1rem" />}
      />
    </Tooltip>
  )
}

export default AngreKnapp

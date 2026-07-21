import { ArrowUndoIcon } from '@navikt/aksel-icons'
import { Button, Tooltip } from '@navikt/ds-react'
import { useAngreKnapp } from './useAngreKnapp'

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
        data-umami-event="Angreknapp"
        data-color="neutral"
        disabled={disabled}
        onMouseDown={(event: { preventDefault: () => void }) => {
          event.preventDefault()
          undo()
        }}
        variant="tertiary"
        size="small"
        icon={<ArrowUndoIcon fontSize="1rem" />}
      />
    </Tooltip>
  )
}

export default AngreKnapp

import { Button, Tooltip } from '@navikt/ds-react'
import { LinkIcon } from '@navikt/aksel-icons'
import { useLinkToolbarButton, useLinkToolbarButtonState } from '@platejs/link/react'
import { useBreveditorContext } from '../Breveditor.tsx'

const LinkKnapp = () => {
  const { disabled, active, onMouseDown, onClick } = useLinkKnapp()
  return (
    <Tooltip
      content={'Link'}
      keys={
        window.navigator.platform.startsWith('Mac') || window.navigator.platform === 'iPhone' ? ['⌘ + K'] : ['Ctrl + K']
      }
    >
      <Button
        disabled={disabled}
        variant={active ? 'primary-neutral' : 'tertiary-neutral'}
        size="small"
        icon={<LinkIcon fontSize="1rem" />}
        onClick={onClick}
        onMouseDown={onMouseDown}
      />
    </Tooltip>
  )
}

export default LinkKnapp

export const useLinkKnapp = () => {
  const breveditor = useBreveditorContext()
  const state = useLinkToolbarButtonState()
  const {
    props: { pressed, onClick, onMouseDown },
  } = useLinkToolbarButton(state)
  return {
    onClick,
    onMouseDown,
    active: breveditor.erPlateContentFokusert && pressed,
    disabled: !breveditor.erPlateContentFokusert,
  }
}

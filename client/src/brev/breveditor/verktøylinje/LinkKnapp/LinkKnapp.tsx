import { LinkIcon } from '@navikt/aksel-icons'
import { Button, Tooltip } from '@navikt/ds-react'
import { useLinkKnapp } from './useLinkKnapp'

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

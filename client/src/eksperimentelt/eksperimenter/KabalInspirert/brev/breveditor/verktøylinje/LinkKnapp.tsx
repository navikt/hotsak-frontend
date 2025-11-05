import { Button, Tooltip } from '@navikt/ds-react'
import { LinkIcon } from '@navikt/aksel-icons'
import { useLinkToolbarButton, useLinkToolbarButtonState } from '@platejs/link/react'
import { useBreveditorContext } from '../Breveditor.tsx'

const LinkKnapp = () => {
  const breveditor = useBreveditorContext()
  const state = useLinkToolbarButtonState()
  const {
    props: { pressed, onClick, onMouseDown },
  } = useLinkToolbarButton(state)
  const active = breveditor.erPlateContentFokusert && pressed
  return (
    <Tooltip
      content={'Link'}
      keys={
        window.navigator.platform.startsWith('Mac') || window.navigator.platform === 'iPhone' ? ['⌘ + K'] : ['Ctrl + K']
      }
    >
      <Button
        disabled={!breveditor.erPlateContentFokusert}
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

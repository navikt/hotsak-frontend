import { useLinkToolbarButton, useLinkToolbarButtonState } from '@platejs/link/react'
import { useBreveditorContext } from '../../BreveditorContext'

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

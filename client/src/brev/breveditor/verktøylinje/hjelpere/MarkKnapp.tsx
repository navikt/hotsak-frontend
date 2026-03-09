import { Button, Tooltip } from '@navikt/ds-react'
import { useEditorState } from 'platejs/react'
import { ReactNode } from 'react'
import { useBreveditorContext } from '../../BreveditorContext'

const MarkKnapp = ({
  tittel,
  markKey,
  ikon,
  shortcuts,
}: {
  tittel: string
  markKey: string
  ikon: ReactNode
  shortcuts?: string[]
}) => {
  const { disabled, active, toggle } = useMarkKnapp(markKey)
  return (
    <Tooltip content={tittel} keys={shortcuts}>
      <Button
        disabled={disabled}
        onMouseDown={(event: { preventDefault: () => void }) => {
          event.preventDefault()
          toggle()
        }}
        variant={active ? 'primary-neutral' : 'tertiary-neutral'}
        size="small"
        icon={ikon}
      />
    </Tooltip>
  )
}

export default MarkKnapp

export const useMarkKnapp = (markKey: string) => {
  const editor = useEditorState()
  const breveditor = useBreveditorContext()

  const isActive = (() => {
    if (!breveditor.erPlateContentFokusert) return false
    if (!editor.selection) return false
    try {
      return !!editor.api.mark(markKey)
    } catch {
      return false
    }
  })()

  return {
    toggle: () => editor.tf.toggleMark(markKey),
    active: isActive,
    disabled: !breveditor.erPlateContentFokusert,
  }
}

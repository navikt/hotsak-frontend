import { Button, Tooltip } from '@navikt/ds-react'
import { useEditorState } from 'platejs/react'
import { ReactNode } from 'react'
import { useBreveditorContext } from '../../Breveditor.tsx'

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
  return {
    toggle: () => editor.tf.toggleMark(markKey),
    active: breveditor.erPlateContentFokusert && !!editor.api.mark(markKey),
    disabled: !breveditor.erPlateContentFokusert,
  }
}

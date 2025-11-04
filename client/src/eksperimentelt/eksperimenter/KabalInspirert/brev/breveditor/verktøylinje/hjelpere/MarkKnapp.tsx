import { Button, Tooltip } from '@navikt/ds-react'
import { useEditorState } from 'platejs/react'
import type { ReactNode } from 'react'
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
  const breveditor = useBreveditorContext()
  const editor = useEditorState()
  const active = breveditor.erPlateContentFokusert && !!editor.api.mark(markKey)
  return (
    <Tooltip content={tittel} keys={shortcuts}>
      <Button
        disabled={!breveditor.erPlateContentFokusert}
        onMouseDown={(event: { preventDefault: () => void }) => {
          event.preventDefault()
          editor.tf.toggleMark(markKey)
        }}
        variant={active ? 'primary-neutral' : 'tertiary-neutral'}
        size="small"
        icon={ikon}
      />
    </Tooltip>
  )
}

export default MarkKnapp

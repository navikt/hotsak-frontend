import { Button, Tooltip } from '@navikt/ds-react'
import { PlusIcon } from '@navikt/aksel-icons'
import { useEditorRef } from 'platejs/react'
import { useBreveditorContext } from '../BreveditorContext'

const SettInnHeaderKnapp = () => {
  const breveditor = useBreveditorContext()
  const editor = useEditorRef()
  return (
    <Tooltip content={'Test: sett inn brev-header komponent'} keys={[]}>
      <Button
        data-color="neutral"
        disabled={!breveditor.erBreveditorEllerVerktoylinjeFokusert}
        onMouseDown={(event: { preventDefault: () => void }) => {
          event.preventDefault()
          editor.tf.insertNode({
            type: 'brevHeader',
            children: [{ text: '' }],
          })
        }}
        variant="tertiary"
        size="small"
        icon={<PlusIcon fontSize="1rem" />}
      />
    </Tooltip>
  )
}

export default SettInnHeaderKnapp

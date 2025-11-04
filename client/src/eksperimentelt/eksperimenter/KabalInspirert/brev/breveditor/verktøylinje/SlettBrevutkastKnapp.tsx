import { Button, Tooltip } from '@navikt/ds-react'
import { TrashIcon } from '@navikt/aksel-icons'
import { useBreveditorContext } from '../Breveditor.tsx'

const SlettBrevutkastKnapp = ({}: {}) => {
  const breveditor = useBreveditorContext()
  if (!breveditor.onSlettBrev) return undefined
  return (
    <Tooltip content={'Slett brevutkast'} keys={[]}>
      <Button
        onMouseDown={(event: { preventDefault: () => void }) => {
          event.preventDefault()
          breveditor.onSlettBrev && breveditor.onSlettBrev()
        }}
        variant="tertiary-neutral"
        size="small"
        icon={<TrashIcon fontSize="1rem" />}
      />
    </Tooltip>
  )
}

export default SlettBrevutkastKnapp

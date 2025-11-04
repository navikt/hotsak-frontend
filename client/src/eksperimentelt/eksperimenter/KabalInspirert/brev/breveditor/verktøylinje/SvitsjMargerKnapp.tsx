import { Button, Tooltip } from '@navikt/ds-react'
import { ExpandIcon, ShrinkIcon } from '@navikt/aksel-icons'
import { useBreveditorContext } from '../Breveditor.tsx'

const SvitsjMargerKnapp = ({}: {}) => {
  const breveditor = useBreveditorContext()
  return (
    <Tooltip content={!breveditor.visMarger ? 'Vis marger' : 'Skjul marger'} keys={[]}>
      <Button
        icon={!breveditor.visMarger ? <ShrinkIcon fontSize="1rem" /> : <ExpandIcon fontSize="1rem" />}
        onClick={() => breveditor.settVisMarger(!breveditor.visMarger)}
        variant={breveditor.visMarger ? 'tertiary-neutral' : 'primary-neutral'}
        size="small"
      />
    </Tooltip>
  )
}

export default SvitsjMargerKnapp

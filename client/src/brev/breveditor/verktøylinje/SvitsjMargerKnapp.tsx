import { Button, Tooltip } from '@navikt/ds-react'
import { ExpandIcon, ShrinkIcon } from '@navikt/aksel-icons'
import { useBreveditorContext } from '../BreveditorContext'

export function SvitsjMargerKnapp() {
  const breveditor = useBreveditorContext()
  return (
    <Tooltip content={!breveditor.visMarger ? 'Vis marger' : 'Skjul marger'} keys={[]}>
      <Button
        data-umami-event="Svitsj-marger-knapp"
        icon={!breveditor.visMarger ? <ShrinkIcon fontSize="1rem" /> : <ExpandIcon fontSize="1rem" />}
        onClick={() => breveditor.settVisMarger(!breveditor.visMarger)}
        variant={breveditor.visMarger ? 'tertiary-neutral' : 'primary-neutral'}
        size="small"
      />
    </Tooltip>
  )
}

import { Button, Tooltip } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { useMarkKnapp } from './useMarkKnapp'

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

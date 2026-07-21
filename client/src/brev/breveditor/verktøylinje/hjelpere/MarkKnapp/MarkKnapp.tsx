import { Button, Tooltip } from '@navikt/ds-react'
import { ReactNode } from 'react'
import { useMarkKnapp } from './useMarkKnapp'

const MarkKnapp = ({
  tittel,
  markKey,
  ikon,
  shortcuts,
  ...rest
}: {
  tittel: string
  markKey: string
  ikon: ReactNode
  shortcuts?: string[]
  [key: string]: unknown
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
        {...rest}
      />
    </Tooltip>
  )
}

export default MarkKnapp

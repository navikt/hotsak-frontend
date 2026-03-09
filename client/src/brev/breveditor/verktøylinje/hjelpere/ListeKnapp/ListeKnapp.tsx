import { Button, Tooltip } from '@navikt/ds-react'
import type { ReactNode } from 'react'
import { useListeKnapp } from './useListeKnapp'

const ListeKnapp = ({ tittel, listeStilType, ikon }: { tittel: string; listeStilType: string; ikon: ReactNode }) => {
  const { disabled, onClick, active } = useListeKnapp(listeStilType)
  return (
    <Tooltip content={tittel} keys={[]}>
      <Button
        disabled={disabled}
        icon={ikon}
        size="small"
        variant={active ? 'primary-neutral' : 'tertiary-neutral'}
        onClick={onClick}
      />
    </Tooltip>
  )
}

export default ListeKnapp

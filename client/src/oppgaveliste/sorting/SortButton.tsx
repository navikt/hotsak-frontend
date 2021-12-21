import styled from 'styled-components/macro'
import { SortOrder } from '../../types/types.internal'
import { Button } from '@navikt/ds-react' 
import { Kolonne } from '../OppgaverTable'
import { SorteringsIkon } from '../../felleskomponenter/ikoner/Sorteringsikon'

interface SortButtonProps {
  column: Kolonne
  sortOrder: SortOrder
  onClick: Function
  active: boolean
}

const ToggleButton = styled(Button)`
color: var(--navds-semantic-color-text);
`

export const SortButton: React.FC<SortButtonProps> = ({ sortOrder, onClick, column, active, children}) => {

  return (
    <ToggleButton  size="small" variant="tertiary" onClick={() => onClick(column, sortOrder = sortOrder === SortOrder.DESCENDING ? SortOrder.ASCENDING : SortOrder.DESCENDING)} >
      {children} 
      {<SorteringsIkon active={active} sortOrder={sortOrder}/>}
    </ToggleButton>
  )
}

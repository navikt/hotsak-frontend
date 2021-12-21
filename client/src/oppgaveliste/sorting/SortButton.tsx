//import styled from 'styled-components/macro'
import { SortOrder } from '../../types/types.internal'
import { Button } from '@navikt/ds-react' 
import { Kolonne } from '../OppgaverTable'
//import { SorteringsIkon } from '../../felleskomponenter/ikoner/Sorteringsikon'
import { Down, Up } from '@navikt/ds-icons'

interface SortButtonProps {
  column: Kolonne
  sortOrder: SortOrder
  onClick: Function
  active: boolean
}

/*const ToggleButton = styled(Button)`
color: var(--navds-semantic-color-text);
`*/

export const SortButton: React.FC<SortButtonProps> = ({ sortOrder, onClick, column, active, children}) => {

  return (
    <Button  size="small" variant={ "tertiary"} onClick={() => onClick(column, sortOrder = sortOrder === SortOrder.DESCENDING ? SortOrder.ASCENDING : SortOrder.DESCENDING)} >
      {children} 
      {active && sortOrder === SortOrder.ASCENDING && <Up  height={16} />}
      {active && sortOrder === SortOrder.DESCENDING && <Down  height={16} />}
      {/*<SorteringsIkon active={active} sortOrder={sortOrder}/>*/}
    </Button>
  )
}

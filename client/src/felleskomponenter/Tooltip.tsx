import ReactTooltip from 'react-tooltip'
import styled from 'styled-components/macro'

export const Tooltip = styled(ReactTooltip)`
  padding: 2px 8px !important;
  font-size: 14px !important;
  line-height: 20px !important;
  border-width: 0 !important;
  border-radius: 4px;
  box-shadow: 0 1px 2px var(--navds-color-border);
  background-color: var(--navds-color-orange-10) !important;
  color: var(--navds-color-text-primary) !important;
  border-color: var(--navds-color-border) !important;

  &:after {
    display: none !important;
  }
`

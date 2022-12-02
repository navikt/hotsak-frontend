import ReactTooltip from 'react-tooltip'
import styled from 'styled-components'

export const Tooltip = styled(ReactTooltip)`
  padding: 2px 8px !important;
  font-size: 14px !important;
  line-height: 20px !important;
  border-width: 0 !important;
  border-radius: 4px;
  box-shadow: 0 1px 2px var(--a-border-default);
  background-color: var(--a-surface-warning-subtle) !important;
  color: var(--a-text-default) !important;
  border-color: var(--a-border-default) !important;

  &:after {
    display: none !important;
  }
`

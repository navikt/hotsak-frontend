import ReactTooltip from 'react-tooltip'
import styled from 'styled-components/macro'

export const Tooltip = styled(ReactTooltip)`
  padding: 2px 8px !important;
  font-size: 14px !important;
  line-height: 20px !important;
  border-width: 0 !important;
  border-radius: 4px;
  box-shadow: 0 1px 2px var(--navds-semantic-color-border-muted);
  background-color: var(--navds-semantic-color-feedback-warning-background) !important;
  color: var(--navds-semantic-color-text) !important;
  border-color: var(--navds-semantic-color-border-muted) !important;

  &:after {
    display: none !important;
  }
`

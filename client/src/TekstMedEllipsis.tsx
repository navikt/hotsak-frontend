import styled from 'styled-components/macro'

export const TekstMedEllipsis = styled.p`
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  > a:focus {
    box-shadow: 0 0 0 3px var(--navds-text-focus);
  }
`

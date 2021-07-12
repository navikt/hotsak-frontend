import styled from '@emotion/styled'

export const Row = styled.tr`
  position: relative;

  &:nth-of-type(2n + 1) {
    background-color: var(--speil-table-row-background-color-alternate);
  }
`

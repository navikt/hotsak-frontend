import styled from '@emotion/styled'
import React from 'react'

export const Row = styled.tr`
  position: relative;

  &:nth-of-type(2n + 1) {
    background-color: var(--speil-table-row-background-color-alternate);
  }
`

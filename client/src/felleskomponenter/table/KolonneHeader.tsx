import styled from 'styled-components/macro'
import { Table } from '@navikt/ds-react'

export const KolonneHeader = styled(Table.ColumnHeader)<{ width?: number }>`
  ${({ width }) =>
    width &&
    `
      width: ${width}px;
      max-width: ${width}px;
      min-width: ${width}px;
      white-space: nowrap;
`}
`

export const DataCell = styled(Table.DataCell)<{ width?: number }>`
  ${({ width }) =>
    width &&
    `
    width: ${width}px;
    min-width:  ${width}px;
    max-width:  ${width}px;
    white-space: nowrap;
`}
`

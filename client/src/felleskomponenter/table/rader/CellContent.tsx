import styled from 'styled-components/macro'

export const CellContent = styled.div<{ width?: number }>`
  
  ${({ width }) =>
    width &&
    `
        width: ${width}px;
        max-width: ${width}px;
    `}
`

import styled from '@emotion/styled'

export const CellContent = styled.div<{ width?: number }>`
  position: relative;
  height: 2rem;
  display: flex;
  align-items: center;

  ${({ width }) =>
    width &&
    `
        width: ${width}px;
        max-width: ${width}px;
    `}
`

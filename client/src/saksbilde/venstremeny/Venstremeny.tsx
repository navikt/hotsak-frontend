import React from 'react'
import styled from 'styled-components'

import { hotsaktVenstremenyWidth } from '../../GlobalStyles'

type VenstremenyProps = {
  width?: string
}

const Container = styled.aside<VenstremenyProps>`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: ${(props) => props.width || hotsaktVenstremenyWidth};
  min-width: 19.5rem;
  padding: 2rem 1.5rem;
  border-right: 1px solid var(--a-border-default);
`

export const VenstreMeny: React.FC<{ width?: string; children: React.ReactNode }> = ({ width, children }) => {
  return <Container width={width}>{children}</Container>
}

import React from 'react'
import styled from 'styled-components'

import { Tekst } from './typografi'

const Container = styled.div`
  padding: 1rem;
`

export const IngentingFunnet: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <Container>
    <Tekst>{children}</Tekst>
  </Container>
)

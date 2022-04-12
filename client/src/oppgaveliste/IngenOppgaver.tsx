import React from 'react'
import styled from 'styled-components/macro'

import { Tekst } from '../felleskomponenter/typografi'

const Container = styled.div`
  padding: 1rem;
`

export const IngentingFunnet: React.FC = ({ children }) => (
  <Container>
    <Tekst>{children}</Tekst>
  </Container>
)

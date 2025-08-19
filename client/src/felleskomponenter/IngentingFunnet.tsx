import type { ReactNode } from 'react'
import styled from 'styled-components'

import { Tekst } from './typografi'

export function IngentingFunnet({ children }: { children: ReactNode }) {
  return (
    <Container>
      <Tekst>{children}</Tekst>
    </Container>
  )
}

const Container = styled.div`
  padding: 1rem;
`

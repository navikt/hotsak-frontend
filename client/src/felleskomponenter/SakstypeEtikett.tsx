import { memo } from 'react'
import styled from 'styled-components'

import { Sakstype } from '../types/types.internal.ts'
import { Oppgaveetikett } from './Oppgaveetikett.tsx'

export interface SakstypeEtikettProps {
  sakstype: Sakstype
}

export const SakstypeEtikett = memo(({ sakstype }: SakstypeEtikettProps) => {
  return (
    <Container>
      <Oppgaveetikett type={sakstype} showLabel={true} />
    </Container>
  )
})

const Container = styled.div`
  display: flex;
`

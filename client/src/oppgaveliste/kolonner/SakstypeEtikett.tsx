import { memo } from 'react'
import styled from 'styled-components'

import { Oppgaveetikett } from '../../felleskomponenter/Oppgaveetikett'
import { Sakstype } from '../../types/types.internal'

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

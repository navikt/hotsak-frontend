import styled from 'styled-components'

import { Oppgaveetikett } from '../../felleskomponenter/Oppgaveetikett'
import { Sakstype } from '../../types/types.internal'
import { memo } from 'react'

interface SakstypeEtikettProps {
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

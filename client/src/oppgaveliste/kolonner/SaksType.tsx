import React from 'react'
import styled from 'styled-components'

import { Oppgaveetikett } from '../../felleskomponenter/Oppgaveetikett'
import { Sakstype } from '../../types/types.internal'

interface SakstypeProps {
  sakstype: Sakstype
}

const Container = styled.div`
  display: flex;
`

export const SakstypeEtikett = React.memo(({ sakstype }: SakstypeProps) => {
  return (
    <Container>
      <Oppgaveetikett type={sakstype} showLabel={true} />
    </Container>
  )
})

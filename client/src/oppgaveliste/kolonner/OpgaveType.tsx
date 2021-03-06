import React from 'react'
import styled from 'styled-components'

import { Oppgaveetikett } from '../../felleskomponenter/Oppgaveetikett'
import { Oppgavetype } from '../../types/types.internal'

interface OppgaveTypeProps {
  oppgaveType: Oppgavetype
}

const Container = styled.div`
  display: flex;
`

export const OppgaveType = React.memo(({ oppgaveType }: OppgaveTypeProps) => {
  return (
    <Container>
      <Oppgaveetikett type={oppgaveType} showLabel={true} />
    </Container>
  )
})

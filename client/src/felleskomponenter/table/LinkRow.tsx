import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { Table } from '@navikt/ds-react'

import { Oppgavetype } from '../../types/types.internal'

const ClickableRow = styled(Table.Row)`
  &:hover,
  &:focus {
    cursor: pointer;
    outline: none;
  }
`
interface LinkRowProps {
  saksnummer: string
  oppgaveType: Oppgavetype
}

export const LinkRow: React.FC<LinkRowProps> = ({ saksnummer, oppgaveType, children }) => {
  const history = useHistory()

  const navigate = () => {
    switch (oppgaveType) {
      case Oppgavetype.BESTILLING:
        history.push(`/bestilling/${saksnummer}/hjelpemidler`)
        break
      case Oppgavetype.SØKNAD:
      default:
        history.push(`/sak/${saksnummer}/hjelpemidler`)
    }
  }

  return (
    <ClickableRow role="link" tabIndex={0} onClick={navigate}>
      {children}
    </ClickableRow>
  )
}

import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components'

import { Table } from '@navikt/ds-react'

const ClickableRow = styled(Table.Row)`
  &:hover,
  &:focus {
    cursor: pointer;
    outline: none;
  }
`
interface LinkRowProps {
  saksnummer: string
}

export const LinkRow: React.FC<LinkRowProps> = ({ saksnummer, children }) => {
  const history = useHistory()

  const navigate = () => {
    history.push(`/sak/${saksnummer}/hjelpemidler`)
  }

  return (
    <ClickableRow tabIndex={0} onClick={navigate}>
      {children}
    </ClickableRow>
  )
}

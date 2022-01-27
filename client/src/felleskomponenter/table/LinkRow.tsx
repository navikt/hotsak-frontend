import React from 'react'
import { useHistory } from 'react-router-dom'
import { Panel, Table } from '@navikt/ds-react'
import styled from 'styled-components/macro'

import { Row } from './Row'

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
    const destinationUrl = `/sak/${saksnummer}/hjelpemidler`
    history.push(destinationUrl)
  }

  return (
    <ClickableRow role="link" tabIndex={0} onClick={navigate}>
      {children}
    </ClickableRow>
  )
}

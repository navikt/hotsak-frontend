import React from 'react'
import { useHistory } from 'react-router-dom'
import styled from 'styled-components/macro'

import { Row } from './Row'

const HighlightOnHoverRow = styled(Row)`
  &:hover,
  &:focus {
    background-color: var(--speil-light-hover-tabell);
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
    <HighlightOnHoverRow role="link" tabIndex={0} onClick={navigate}>
      {children}
    </HighlightOnHoverRow>
  )
}

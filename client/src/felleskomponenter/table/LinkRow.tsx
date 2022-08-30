import React from 'react'
import { useNavigate } from 'react-router-dom'
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
  children: React.ReactNode
}

export const LinkRow: React.FC<LinkRowProps> = ({ saksnummer, children }) => {
  const navigate = useNavigate()
  return (
    <ClickableRow
      tabIndex={0}
      onClick={() => {
        navigate(`/sak/${saksnummer}/hjelpemidler`)
      }}
    >
      {children}
    </ClickableRow>
  )
}

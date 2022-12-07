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
  path: string
  children: React.ReactNode
}

export const LinkRow: React.FC<LinkRowProps> = ({ path, children }) => {
  const navigate = useNavigate()
  return (
    <ClickableRow
      tabIndex={0}
      onClick={() => {
        navigate(path)
      }}
    >
      {children}
    </ClickableRow>
  )
}

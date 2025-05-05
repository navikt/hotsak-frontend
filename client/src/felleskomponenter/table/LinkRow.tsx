import type { ReactNode } from 'react'
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
  children: ReactNode
}

export function LinkRow({ path, children }: LinkRowProps) {
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

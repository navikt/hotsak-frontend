import { isValidElement, ReactNode } from 'react'
import { CopyButton, HGrid, HGridProps } from '@navikt/ds-react'
import styled from 'styled-components'
import { Tekst } from '../../felleskomponenter/typografi'

export interface CardRowProps {
  children: ReactNode
  icon?: ReactNode
  copyText?: string
  align?: HGridProps['align']
  columns?: HGridProps['columns']
}

export function CardRow(props: CardRowProps) {
  const { children, icon, copyText, align, columns } = props
  return (
    <HGrid gap="2" align={align} columns={columns || '1.25rem auto 1.25rem'}>
      <Ikon>{icon}</Ikon>
      {isValidElement(children) ? children : <Tekst>{children}</Tekst>}
      {copyText && <CopyButton copyText={copyText} size="small" />}
    </HGrid>
  )
}

const Ikon = styled.div`
  font-size: var(--a-font-size-xlarge);
`

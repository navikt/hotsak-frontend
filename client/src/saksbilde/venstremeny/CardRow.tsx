import { isValidElement, ReactNode } from 'react'
import { CopyButton, HGrid, HGridProps, HStack } from '@navikt/ds-react'
import styled from 'styled-components'
import { Tekst } from '../../felleskomponenter/typografi'

export interface CardRowProps {
  children: ReactNode
  icon?: ReactNode
  copyText?: string
  align?: HGridProps['align']
  columns?: HGridProps['columns']
}

const hStack = true

export function CardRow(props: CardRowProps) {
  const { children, icon, copyText, align, columns } = props

  if (hStack) {
    return (
      <HStack gap="2" align={align || (copyText ? 'center' : align)} wrap={false}>
        <Ikon>{icon}</Ikon>
        {isValidElement(children) ? children : <Tekst>{children}</Tekst>}
        {copyText && <CopyButton copyText={copyText} size="small" />}
      </HStack>
    )
  }

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

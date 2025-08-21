import { CopyButton, HGrid, HGridProps, VStack } from '@navikt/ds-react'
import { isValidElement, ReactNode } from 'react'
import styled from 'styled-components'

import { Etikett, Tekst } from '../../felleskomponenter/typografi'

export interface VenstremenyCardRowProps {
  children: ReactNode
  icon?: ReactNode
  title?: string
  copyText?: string
  paddingBlock?: HGridProps['paddingBlock']
  align?: HGridProps['align']
  columns?: HGridProps['columns']
  skjulKopiknapp?: boolean
}

const hStack = true

export function VenstremenyCardRow(props: VenstremenyCardRowProps) {
  const { children, icon, copyText, paddingBlock, align, columns, title, skjulKopiknapp = false } = props

  if (hStack) {
    return (
      <>
        {title ? (
          <HGrid width="100%" columns={'2rem auto 1.25rem'} paddingBlock={paddingBlock || '0 0'}>
            <Ikon>{icon}</Ikon>
            <VStack>
              <Etikett>{title}</Etikett>
              {isValidElement(children) ? children : <Tekst>{children}</Tekst>}
            </VStack>
            {!skjulKopiknapp && copyText && <RowCopyButton copyText={copyText} size="xsmall" />}
          </HGrid>
        ) : (
          <HGrid width="100%" columns={'1.8rem auto 1.25rem'}>
            <Ikon>{icon}</Ikon>
            {isValidElement(children) ? children : <Tekst>{children}</Tekst>}
            {!skjulKopiknapp && copyText && <RowCopyButton copyText={copyText} size="xsmall" />}
          </HGrid>
        )}
      </>
    )
  }

  return (
    <HGrid gap="2" align={align} columns={columns || '1.25rem auto 1.25rem'}>
      <Ikon>{icon}</Ikon>
      {isValidElement(children) ? children : <Tekst>{children}</Tekst>}
      {copyText && <RowCopyButton copyText={copyText} size="xsmall" />}
    </HGrid>
  )
}

const Ikon = styled.div`
  font-size: var(--ax-font-size-xlarge);
`

const RowCopyButton = styled(CopyButton)`
  height: 20px;
`

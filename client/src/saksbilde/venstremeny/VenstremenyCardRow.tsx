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

export function VenstremenyCardRow(props: VenstremenyCardRowProps) {
  const { children, icon, copyText, title, skjulKopiknapp = false } = props

  return (
    <>
      {title ? (
        <HGrid width="100%" columns={'1.6rem auto 1.25rem'} paddingBlock="space-0 space-8">
          <div>{icon}</div>
          <VStack>
            <Etikett>{title}</Etikett>
            {isValidElement(children) ? children : <Tekst>{children}</Tekst>}
          </VStack>
          {!skjulKopiknapp && copyText && <RowCopyButton copyText={copyText} size="xsmall" />}
        </HGrid>
      ) : (
        <HGrid width="100%" columns={'1.6rem auto 1.25rem'}>
          <div>{icon}</div>
          {isValidElement(children) ? children : <Tekst>{children}</Tekst>}
          {!skjulKopiknapp && copyText && <RowCopyButton copyText={copyText} size="xsmall" />}
        </HGrid>
      )}
    </>
  )
}

const RowCopyButton = styled(CopyButton)`
  height: 20px;
`

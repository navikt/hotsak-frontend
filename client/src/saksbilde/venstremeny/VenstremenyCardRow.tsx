import { CopyButton, HGrid, HGridProps, HStack, VStack } from '@navikt/ds-react'
import { isValidElement, ReactNode } from 'react'
import styled from 'styled-components'

import { Etikett, Tekst } from '../../felleskomponenter/typografi'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude.ts'

export interface VenstremenyCardRowProps {
  children: ReactNode
  icon?: ReactNode
  title?: string
  copyText?: string
  copyKind?: string
  paddingBlock?: HGridProps['paddingBlock']
  align?: HGridProps['align']
  columns?: HGridProps['columns']
}

const hStack = true

export function VenstremenyCardRow(props: VenstremenyCardRowProps) {
  const { children, icon, copyText, copyKind, paddingBlock, align, columns, title } = props

  const onCopy = (): void => {
    logAmplitudeEvent(amplitude_taxonomy.KOPIKNAPP_BRUKT, { hva: copyKind })
  }

  if (hStack) {
    return (
      <HStack gap="2" align={align} wrap={false} paddingBlock={paddingBlock || '0 0'}>
        <Ikon>{icon}</Ikon>
        {title ? (
          <VStack>
            <HStack gap="2" align={align} wrap={false}>
              <Etikett>{title}</Etikett>
              {copyText && <RowCopyButton copyText={copyText} size="xsmall" onClick={onCopy} />}
            </HStack>
            {isValidElement(children) ? children : <Tekst>{children}</Tekst>}
          </VStack>
        ) : (
          <>
            {isValidElement(children) ? children : <Tekst>{children}</Tekst>}
            {copyText && <RowCopyButton copyText={copyText} size="xsmall" onClick={onCopy} />}
          </>
        )}
      </HStack>
    )
  }

  return (
    <HGrid gap="2" align={align} columns={columns || '1.25rem auto 1.25rem'}>
      <Ikon>{icon}</Ikon>
      {isValidElement(children) ? children : <Tekst>{children}</Tekst>}
      {copyText && <RowCopyButton copyText={copyText} size="xsmall" onClick={onCopy} />}
    </HGrid>
  )
}

const Ikon = styled.div`
  font-size: var(--a-font-size-xlarge);
`

const RowCopyButton = styled(CopyButton)`
  height: 20px;
`

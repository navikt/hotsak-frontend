import { CopyButton, HGrid, HGridProps, HStack } from '@navikt/ds-react'
import { isValidElement, ReactNode } from 'react'
import styled from 'styled-components'

import { Tekst } from '../../felleskomponenter/typografi'
import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude.ts'

export interface VenstremenyCardRowProps {
  children: ReactNode
  icon?: ReactNode
  copyText?: string
  copyKind?: string
  align?: HGridProps['align']
  columns?: HGridProps['columns']
}

const hStack = true

export function VenstremenyCardRow(props: VenstremenyCardRowProps) {
  const { children, icon, copyText, copyKind, align, columns } = props

  const onCopy = (): void => {
    logAmplitudeEvent(amplitude_taxonomy.KOPIKNAPP_BRUKT, { hva: copyKind })
  }

  if (hStack) {
    return (
      <HStack gap="2" align={align} wrap={false}>
        <Ikon>{icon}</Ikon>
        {isValidElement(children) ? children : <Tekst>{children}</Tekst>}
        {copyText && <RowCopyButton copyText={copyText} size="xsmall" onClick={onCopy} />}
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

import { useRef } from 'react'
import styled from 'styled-components'
import { InformationSquareIcon } from '@navikt/aksel-icons'
import { ActionMenu, InternalHeader } from '@navikt/ds-react'

import { Endringslogg } from './Endringslogg'
import { useEndringslogg } from './useEndringslogg'

export function EndringsloggMenu() {
  const endringslogg = useEndringslogg()
  const contentRef = useRef<HTMLDivElement>(null)
  return (
    <ActionMenu>
      <ActionMenu.Trigger>
        <InternalHeader.Button
          style={{ position: 'relative' }}
          onClick={() => {
            if (contentRef.current && contentRef.current.getAttribute('aria-hidden') === 'true') {
            }
          }}
        >
          {!endringslogg.loading && <Uleste $fading={endringslogg.fading} />}
          <InformationSquareIcon title="Endringslogg" width={20} height={20} />
        </InternalHeader.Button>
      </ActionMenu.Trigger>
      <ActionMenu.Content ref={contentRef} tabIndex={0}>
        <Endringslogg endringslogginnslag={endringslogg.innslag} merkSomLest={endringslogg.merkSomLest} />
      </ActionMenu.Content>
    </ActionMenu>
  )
}

const Uleste = styled.div<{ $fading: boolean }>`
  position: absolute;
  top: 7px;
  right: 7px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: var(--a-icon-warning);
  visibility: ${(props) => (props.$fading ? 'hidden' : undefined)};
  opacity: ${(props) => (props.$fading ? 0 : undefined)};
  transition: ${(props) => (props.$fading ? 'visibility 0s 2s, opacity 2s linear' : undefined)};
`

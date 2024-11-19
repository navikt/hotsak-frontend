import { useRef } from 'react'
import styled from 'styled-components'

import { InformationSquareIcon } from '@navikt/aksel-icons'
import { Dropdown, InternalHeader } from '@navikt/ds-react'

import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'

import { Endringslogg } from './Endringslogg'
import { useEndringslogg } from './useEndringslogg'

export function EndringsloggDropdown() {
  const endringslogg = useEndringslogg()
  const dropdownMenuRef = useRef<HTMLDivElement>(null)
  return (
    <Dropdown>
      <InternalHeader.Button
        as={Dropdown.Toggle}
        style={{ position: 'relative' }}
        onClick={() => {
          if (dropdownMenuRef.current && dropdownMenuRef.current.getAttribute('aria-hidden') === 'true') {
            logAmplitudeEvent(amplitude_taxonomy.ENDRINGSLOGG_APNET)
          }
        }}
      >
        {!endringslogg.loading && <Uleste $fading={endringslogg.fading} />}
        <InformationSquareIcon title="Endringslogg" width={20} height={20} />
      </InternalHeader.Button>
      <EndringsloggDropdownMenu ref={dropdownMenuRef} tabIndex={0}>
        <Endringslogg endringslogginnslag={endringslogg.innslag} merkSomLest={endringslogg.merkSomLest} />
      </EndringsloggDropdownMenu>
    </Dropdown>
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

const EndringsloggDropdownMenu = styled(Dropdown.Menu)`
  margin: 0;
  padding: 0;
  width: 64ch;
`

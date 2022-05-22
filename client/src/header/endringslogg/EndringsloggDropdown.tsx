import React, { useRef } from 'react'
import styled from 'styled-components'

import { Information } from '@navikt/ds-icons'
import { Dropdown, Header } from '@navikt/ds-react-internal'

import { amplitude_taxonomy, logAmplitudeEvent } from '../../utils/amplitude'

import { Endringslogg } from './Endringslogg'
import { useEndringslogg } from './endringsloggHooks'

export const EndringsloggDropdown: React.VFC = () => {
  const endringslogg = useEndringslogg()
  const dropdownMenuRef = useRef<HTMLDivElement>(null)
  return (
    <Dropdown>
      <Header.Button
        as={Dropdown.Toggle}
        style={{ position: 'relative' }}
        onClick={() => {
          if (dropdownMenuRef.current && dropdownMenuRef.current.getAttribute('aria-hidden') === 'true') {
            logAmplitudeEvent(amplitude_taxonomy.ENDRINGSLOGG_APNET)
          }
        }}
      >
        {!endringslogg.loading && <Uleste fading={endringslogg.fading} />}
        <Information title="Endringslogg" width={20} height={20} />
      </Header.Button>
      <EndringsloggDropdownMenu ref={dropdownMenuRef}>
        <Endringslogg endringslogginnslag={endringslogg.innslag} merkSomLest={endringslogg.merkSomLest} />
      </EndringsloggDropdownMenu>
    </Dropdown>
  )
}

const Uleste = styled.div<{ fading: boolean }>`
  position: absolute;
  top: 7px;
  right: 7px;
  width: 14px;
  height: 14px;
  border-radius: 50%;
  background-color: var(--navds-semantic-color-feedback-warning-icon);
  visibility: ${(props) => (props.fading ? 'hidden' : undefined)};
  opacity: ${(props) => (props.fading ? 0 : undefined)};
  transition: ${(props) => (props.fading ? 'visibility 0s 2s, opacity 2s linear' : undefined)};
`

const EndringsloggDropdownMenu = styled(Dropdown.Menu)`
  margin: 0;
  padding: 0;
  width: 64ch;
`
